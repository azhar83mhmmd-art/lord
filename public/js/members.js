/* Community Feed page — Discord-style activity list with search + filter. */

let allActivities = [];
let currentFilter = null;
let currentQuery = '';

function renderFeed() {
  const feed = document.getElementById('community-feed');
  let items = allActivities;

  if (currentFilter) items = items.filter(a => a.position === currentFilter);
  if (currentQuery) {
    const q = currentQuery.toLowerCase();
    items = items.filter(a => a.nickname.toLowerCase().includes(q));
  }

  if (!items.length) {
    const message = allActivities.length
      ? 'Tidak ada aktivitas yang cocok. Coba ubah kata kunci atau filter posisi.'
      : 'Belum ada aktivitas di komunitas. Jadilah yang pertama <a href="/register.html" style="color:var(--neon-blue);">join squad</a>.';
    feed.innerHTML = `
      <div class="card" style="padding:40px;text-align:center;color:var(--text-muted);">
        ${message}
      </div>`;
    return;
  }

  feed.innerHTML = items.map(a => `
    <div class="card feed-card reveal in-view">
      <img class="avatar-sm" src="https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(a.nickname)}" alt="">
      <div class="feed-body">
        <div class="feed-text"><strong>${escapeHtml(a.nickname)}</strong> ${actionLabel(a.action)}</div>
        <div class="feed-meta">
          <span class="badge badge-${a.position.toLowerCase()}">${a.position}</span>
          <span class="feed-time">${timeAgo(a.timestamp)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

async function initMembersPage() {
  try {
    const [activities, stats, members] = await Promise.all([
      API.getActivities(50),
      API.getStats(),
      API.getMembers()
    ]);
    allActivities = activities;
    renderFeed();

    document.getElementById('sidebar-online-count').textContent = stats.onlineMembers;
    document.getElementById('sidebar-new-count').textContent = stats.newMembersToday;
    document.getElementById('sidebar-total-count').textContent = stats.totalMembers;

    const topPos = Object.entries(stats.positionCount).sort((a,b) => b[1]-a[1])[0];
    document.getElementById('sidebar-top-pos').textContent = topPos ? `${topPos[0]} (${topPos[1]})` : '—';
    document.getElementById('sidebar-activity-count').textContent = stats.activityToday;

    const online = members.filter(m => m.status === 'online').slice(0, 6);
    document.getElementById('sidebar-online-list').innerHTML = online.map(m => `
      <div class="mini-avatar-row">
        <img src="${m.avatar}" alt="">
        <div>
          <div class="mini-name">${escapeHtml(m.nickname)}</div>
          <div class="mini-sub">${m.position}</div>
        </div>
      </div>
    `).join('') || '<p style="color:var(--text-muted);font-size:13px;">Belum ada yang online.</p>';

    wireSearch(document.getElementById('feed-search'), (q) => { currentQuery = q; renderFeed(); });
    wireFilterChips(document.getElementById('feed-filters'), (val) => { currentFilter = val; renderFeed(); });
  } catch (err) {
    console.error(err);
    showToast('Gagal memuat Community Feed.');
  }
}
