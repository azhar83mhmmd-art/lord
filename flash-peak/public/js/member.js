/* Detail Anggota page — reads ?id=FP-0001 from the URL. */

async function initMemberDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const container = document.getElementById('member-detail');

  if (!id) {
    container.innerHTML = `
      <div class="card" style="padding:40px;text-align:center;color:var(--text-muted);">
        Tidak ada anggota yang dipilih. Kembali ke <a href="/members.html" style="color:var(--neon-blue);">Community Feed</a>.
      </div>`;
    return;
  }

  try {
    const member = await API.getMember(id);
    container.innerHTML = `
      <div class="card" style="padding:32px;">
        <div style="display:flex;gap:20px;align-items:center;">
          <div class="avatar-wrap">
            <img src="${member.avatar}" alt="" style="width:84px;height:84px;border-radius:50%;border:2px solid var(--border-strong);">
            <span class="status-dot status-${member.status}" style="width:12px;height:12px;"></span>
          </div>
          <div>
            <div style="font-family:var(--font-display);font-weight:800;font-size:24px;">${escapeHtml(member.nickname)}</div>
            <div style="color:var(--text-muted);font-size:13px;margin-top:2px;">${member.memberId} &middot; ${member.role}</div>
            <div style="margin-top:10px;display:flex;gap:8px;">
              <span class="badge badge-${member.position.toLowerCase()}">${member.position}</span>
            </div>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:28px;">
          <div class="card" style="padding:16px;text-align:center;">
            <div style="font-family:var(--font-display);font-weight:800;font-size:22px;">${member.matches}</div>
            <div style="font-size:12.5px;color:var(--text-muted);margin-top:4px;">Matches</div>
          </div>
          <div class="card" style="padding:16px;text-align:center;">
            <div style="font-family:var(--font-display);font-weight:800;font-size:22px;color:var(--neon-green);">${member.winRate}%</div>
            <div style="font-size:12.5px;color:var(--text-muted);margin-top:4px;">Win Rate</div>
          </div>
          <div class="card" style="padding:16px;text-align:center;">
            <div style="font-family:var(--font-display);font-weight:800;font-size:15px;">${formatDisplayDate(member.joinDate)}</div>
            <div style="font-size:12.5px;color:var(--text-muted);margin-top:4px;">Bergabung</div>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `
      <div class="card" style="padding:40px;text-align:center;color:var(--text-muted);">
        ${err.message}
      </div>`;
  }
}
