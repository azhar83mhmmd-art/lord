/* Leaderboard page — full ranked list of top players by win rate. */

async function initLeaderboardPage() {
  try {
    const top = await API.getTopPlayers();
    const list = document.getElementById('leaderboard-list');

    list.innerHTML = top.length ? top.map((m, i) => `
      <div class="card top-player-row rank-${i + 1} reveal in-view" style="margin-bottom:10px;">
        <span class="rank-num">${i + 1}</span>
        <img src="${m.avatar}" alt="">
        <div class="tp-info">
          <div class="tp-name">${escapeHtml(m.nickname)}</div>
          <div class="tp-stats">${m.matches} matches &middot; ${m.position}</div>
        </div>
        <span class="tp-winrate">${m.winRate}%</span>
      </div>
    `).join('') : `<div class="card" style="padding:40px;text-align:center;color:var(--text-muted);">Belum ada data leaderboard. Peringkat akan muncul begitu anggota mulai bermain.</div>`;
  } catch (err) {
    console.error(err);
    showToast('Gagal memuat leaderboard.');
  }
}
