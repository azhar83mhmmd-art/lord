/* Jadwal Mabar page — full weekly schedule grid. */

async function initSchedulePage() {
  try {
    const settings = await API.getSettings();
    const grid = document.getElementById('full-schedule-grid');

    grid.innerHTML = settings.schedule.map(s => `
      <div class="card schedule-card reveal in-view">
        <div class="sch-day">${s.day}</div>
        <div class="sch-time">${s.time}</div>
        <div class="sch-mode">${s.mode}</div>
        <div class="sch-slots">${ICONS.member} ${s.slots} slot tersedia</div>
      </div>
    `).join('');
  } catch (err) {
    console.error(err);
    showToast('Gagal memuat jadwal mabar.');
  }
}
