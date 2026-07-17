/* Leaderboard page — ranked list of members by join order (earliest
   member = highest rank). Re-runs live via subscribeDashboardRealtime
   in leaderboard.html whenever the members table changes. */

async function initLeaderboardPage() {
  try {
    const top = await API.getTopPlayers();
    const list = document.getElementById('leaderboard-list');

    list.innerHTML = top.length ? top.map((m, i) => `
      <div class="card top-player-row rank-${i + 1} reveal in-view" style="margin-bottom:10px;">
        <span class="rank-num">${i + 1}</span>
        <img src="${m.avatar}" alt="" onerror="this.onerror=null;this.src='/assets/avatar-fallback.svg';">
        <div class="tp-info">
          <div class="tp-name">${escapeHtml(m.username)}</div>
          <div class="tp-stats">Member ID ${escapeHtml(m.memberId)}</div>
        </div>
        <span class="badge badge-${m.position.toLowerCase()}">${m.position}</span>
      </div>
    `).join('') : `<div class="card" style="padding:40px;text-align:center;color:var(--text-muted);">Belum ada data leaderboard. Peringkat akan muncul begitu anggota mulai bergabung.</div>`;
  } catch (err) {
    console.error(err);
    showToast('Gagal memuat leaderboard.');
  }
}
