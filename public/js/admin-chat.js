/* Admin chat inbox: lists every visitor conversation, lets the admin
   open any one (not just the newest) and reply to it. New incoming
   visitor messages arrive in real time via Supabase Realtime, both as
   a sidebar refresh (so a new/updated conversation bubbles to the top
   with an unread badge) and, if that conversation is currently open,
   appended straight into the thread. */

let adminChatState = {
  activeId: null,
  lastMessageCount: 0,
  threadChannel: null,
  sidebarChannel: null,
  conversations: []
};

function formatInboxTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay
    ? d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}

function initials(name) {
  return (name || '?').trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

async function loadInboxList() {
  try {
    const { conversations } = await API.listChats();
    adminChatState.conversations = conversations;
    renderInboxList(conversations);
  } catch (err) {
    console.error(err);
    document.getElementById('inbox-list').innerHTML =
      '<div class="inbox-thread-empty">Gagal memuat daftar chat.</div>';
  }
}

function renderInboxList(conversations) {
  const list = document.getElementById('inbox-list');

  if (!conversations.length) {
    list.innerHTML = '<div class="inbox-thread-empty">Belum ada pengunjung yang chat.</div>';
    return;
  }

  list.innerHTML = conversations.map(c => `
    <div class="inbox-item ${c.conversationId === adminChatState.activeId ? 'active' : ''}" data-id="${c.conversationId}">
      <div class="inbox-item-avatar">${initials(c.visitorName)}</div>
      <div class="inbox-item-body">
        <div class="inbox-item-name">
          <span>${escapeHtml(c.visitorName)}</span>
          <span class="inbox-item-time">${formatInboxTime(c.updatedAt)}</span>
        </div>
        <div class="inbox-item-preview">${c.lastMessage ? escapeHtml(c.lastMessage.text) : ''}</div>
      </div>
      ${c.adminUnread > 0 ? `<span class="inbox-unread-badge">${c.adminUnread}</span>` : ''}
    </div>
  `).join('');

  list.querySelectorAll('.inbox-item').forEach(el => {
    el.addEventListener('click', () => openConversation(el.dataset.id));
  });
}

async function openConversation(conversationId) {
  adminChatState.activeId = conversationId;
  renderInboxList(adminChatState.conversations); // re-highlight active row

  const thread = document.getElementById('inbox-thread');
  thread.innerHTML = `
    <div class="chat-header">
      <div class="chat-avatar" data-icon="shield"></div>
      <div class="chat-header-info">
        <div class="chat-header-name" id="thread-visitor-name">Memuat...</div>
      </div>
    </div>
    <div class="chat-messages" id="thread-messages">
      <div class="chat-empty-hint">Memuat percakapan...</div>
    </div>
    <form class="chat-input-bar" id="thread-form">
      <textarea id="thread-input" rows="1" placeholder="Balas sebagai Admin Komunitas Lord..." maxlength="2000"></textarea>
      <button type="submit" class="chat-send-btn" id="thread-send-btn" aria-label="Kirim balasan">
        <span data-icon="send"></span>
      </button>
    </form>
  `;
  thread.querySelectorAll('[data-icon]').forEach(el => {
    const name = el.getAttribute('data-icon');
    if (ICONS[name]) el.innerHTML = ICONS[name];
  });

  try {
    const convo = await API.getChatForAdmin(conversationId);
    document.getElementById('thread-visitor-name').textContent = convo.visitorName;
    renderThreadMessages(convo.messages);
    subscribeThreadRealtime(conversationId);
    loadInboxList(); // refresh unread badge now that it's been cleared
  } catch (err) {
    thread.innerHTML = '<div class="inbox-thread-empty">Gagal memuat percakapan ini.</div>';
    return;
  }

  const form = document.getElementById('thread-form');
  const input = document.getElementById('thread-input');
  const sendBtn = document.getElementById('thread-send-btn');

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 90) + 'px';
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    sendBtn.disabled = true;
    input.value = '';
    input.style.height = 'auto';

    appendThreadMessage({ sender: 'admin', text, timestamp: new Date().toISOString() });

    try {
      await API.sendAdminChatMessage(conversationId, text);
      loadInboxList();
    } catch (err) {
      showToast(err.message || 'Gagal mengirim balasan.');
      input.value = text;
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  });
}

function renderThreadMessages(messages) {
  const box = document.getElementById('thread-messages');
  if (!messages.length) {
    box.innerHTML = '<div class="chat-empty-hint">Belum ada pesan di percakapan ini.</div>';
    adminChatState.lastMessageCount = 0;
    return;
  }
  box.innerHTML = messages.map(m => `
    <div class="chat-bubble-row from-${m.sender === 'admin' ? 'visitor' : 'admin'}">
      <div class="chat-bubble">
        ${escapeHtml(m.text)}
        <span class="chat-bubble-time">${formatInboxTime(m.timestamp)}</span>
      </div>
    </div>
  `).join('');
  // Note: bubble alignment is flipped for the admin's own view — admin
  // messages appear on the right ("from-visitor" reuses the right-aligned
  // gradient style) so the admin sees themself as the "self" side.
  box.scrollTop = box.scrollHeight;
  adminChatState.lastMessageCount = messages.length;
}

function appendThreadMessage(m) {
  const box = document.getElementById('thread-messages');
  if (!box) return;
  if (box.querySelector('.chat-empty-hint')) box.innerHTML = '';

  const row = document.createElement('div');
  row.className = `chat-bubble-row from-${m.sender === 'admin' ? 'visitor' : 'admin'}`;
  row.innerHTML = `
    <div class="chat-bubble">
      ${escapeHtml(m.text)}
      <span class="chat-bubble-time">${formatInboxTime(m.timestamp)}</span>
    </div>
  `;
  box.appendChild(row);
  box.scrollTop = box.scrollHeight;
  adminChatState.lastMessageCount += 1;
}

function subscribeThreadRealtime(conversationId) {
  if (adminChatState.threadChannel) sb.removeChannel(adminChatState.threadChannel);

  adminChatState.threadChannel = sb
    .channel(`admin-thread-${conversationId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_messages',
      filter: `conversation_id=eq.${conversationId}`
    }, (payload) => {
      const row = payload.new;
      // Only append visitor messages via realtime — the admin's own
      // reply is already appended optimistically by the send handler.
      if (row.sender === 'visitor' && adminChatState.activeId === conversationId) {
        appendThreadMessage({ sender: row.sender, text: row.text, timestamp: row.created_at });
      }
    })
    .subscribe();
}

function subscribeSidebarRealtime() {
  if (adminChatState.sidebarChannel) sb.removeChannel(adminChatState.sidebarChannel);

  adminChatState.sidebarChannel = sb
    .channel('admin-inbox-sidebar')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, () => {
      loadInboxList();
    })
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chats' }, () => {
      loadInboxList();
    })
    .subscribe();
}

function initAdminChat() {
  loadInboxList();
  subscribeSidebarRealtime();

  window.addEventListener('beforeunload', () => {
    if (adminChatState.threadChannel) sb.removeChannel(adminChatState.threadChannel);
    if (adminChatState.sidebarChannel) sb.removeChannel(adminChatState.sidebarChannel);
  });
}
