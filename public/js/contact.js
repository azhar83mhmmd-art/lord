/* Visitor-side live chat with the admin — real-time via Supabase.

   The conversationId is saved in localStorage (not sessionStorage) so
   the thread survives a reload, a closed tab, or coming back later on
   the same device/browser. Messages themselves live in Supabase
   (chat_messages table); this page subscribes to Postgres Realtime so
   an admin reply appears instantly without any polling. */

const CHAT_STORAGE_KEY = 'lord_chat_conversation_id';

let chatState = {
  conversationId: null,
  lastMessageCount: 0,
  channel: null
};

function formatChatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function renderChatMessages(messages) {
  const box = document.getElementById('chat-messages');
  const wasNearBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 80;

  if (!messages.length) {
    box.innerHTML = '<div class="chat-empty-hint">Belum ada pesan. Mulai chat dengan admin di bawah ini.</div>';
    return;
  }

  box.innerHTML = messages.map(m => `
    <div class="chat-bubble-row from-${m.sender}">
      <div class="chat-bubble">
        ${escapeHtml(m.text)}
        <span class="chat-bubble-time">${formatChatTime(m.timestamp)}</span>
      </div>
    </div>
  `).join('');

  if (wasNearBottom || chatState.lastMessageCount === 0) {
    box.scrollTop = box.scrollHeight;
  }
  chatState.lastMessageCount = messages.length;
}

function appendSingleMessage(m) {
  const box = document.getElementById('chat-messages');
  const wasNearBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 80;

  if (box.querySelector('.chat-empty-hint')) box.innerHTML = '';

  const row = document.createElement('div');
  row.className = `chat-bubble-row from-${m.sender}`;
  row.innerHTML = `
    <div class="chat-bubble">
      ${escapeHtml(m.text)}
      <span class="chat-bubble-time">${formatChatTime(m.timestamp)}</span>
    </div>
  `;
  box.appendChild(row);
  chatState.lastMessageCount += 1;

  if (wasNearBottom) box.scrollTop = box.scrollHeight;
}

function subscribeRealtime(conversationId) {
  if (chatState.channel) sb.removeChannel(chatState.channel);

  chatState.channel = sb
    .channel(`chat-${conversationId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_messages',
      filter: `conversation_id=eq.${conversationId}`
    }, (payload) => {
      const row = payload.new;
      // Only append admin messages here — the visitor's own message is
      // already rendered optimistically by the send handler below, so
      // appending it again on the realtime echo would duplicate it.
      if (row.sender === 'admin') {
        appendSingleMessage({
          sender: row.sender,
          senderName: row.sender_name,
          text: row.text,
          timestamp: row.created_at
        });
      }
    })
    .subscribe();
}

async function ensureConversation() {
  const savedId = localStorage.getItem(CHAT_STORAGE_KEY);

  if (savedId) {
    try {
      const convo = await API.getChat(savedId);
      chatState.conversationId = convo.conversationId;
      renderChatMessages(convo.messages);
      subscribeRealtime(convo.conversationId);
      return;
    } catch (err) {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    }
  }

  const convo = await API.startChat();
  chatState.conversationId = convo.conversationId;
  localStorage.setItem(CHAT_STORAGE_KEY, convo.conversationId);
  renderChatMessages(convo.messages);
  subscribeRealtime(convo.conversationId);
}

function autoGrowTextarea(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 90) + 'px';
}

function initContactChat() {
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');

  ensureConversation().catch(err => {
    console.error(err);
    document.getElementById('chat-messages').innerHTML =
      '<div class="chat-empty-hint">Gagal memuat chat. Muat ulang halaman untuk mencoba lagi.</div>';
  });

  input.addEventListener('input', () => autoGrowTextarea(input));

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || !chatState.conversationId) return;

    sendBtn.disabled = true;
    input.value = '';
    autoGrowTextarea(input);

    // Optimistic append so the visitor's own message feels instant;
    // the realtime listener above ignores visitor rows to avoid a dupe.
    appendSingleMessage({ sender: 'visitor', text, timestamp: new Date().toISOString() });

    try {
      await API.sendChatMessage(chatState.conversationId, text);
    } catch (err) {
      showToast(err.message || 'Gagal mengirim pesan.');
      input.value = text;
    } finally {
      sendBtn.disabled = false;
      input.focus();
    }
  });

  window.addEventListener('beforeunload', () => {
    if (chatState.channel) sb.removeChannel(chatState.channel);
  });
}
