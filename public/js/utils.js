/* Shared frontend utilities */

function timeAgo(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Baru saja';
  if (diffMins < 60) return `${diffMins} menit lalu`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} hari lalu`;
  return `${Math.floor(diffDays / 30)} bulan lalu`;
}

function formatDisplayDate(dateString) {
  const d = new Date(dateString);
  const bulan = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
  return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

function positionLabel(code) {
  const map = { CB: 'Center Back', CM: 'Center Midfielder', WF: 'Wing Forward', ST: 'Striker' };
  return map[code] || code;
}

function positionIcon(code) {
  const map = { CB: 'posCB', CM: 'posCM', WF: 'posWF', ST: 'posST' };
  return ICONS[map[code]] || '';
}

function actionLabel(action) {
  const map = {
    join: 'Baru saja bergabung sebagai',
    stat_boost: 'Meningkatkan performa sebagai',
    match_win: 'Memenangkan pertandingan sebagai'
  };
  return map[action] || 'Melakukan aktivitas sebagai';
}

function actionIcon(action) {
  const map = { join: 'userPlus', stat_boost: 'trending', match_win: 'trophy' };
  return ICONS[map[action]] || ICONS.activity;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function animateCounter(el, target, duration = 900) {
  const start = 0;
  const startTime = performance.now();
  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(start + (target - start) * eased);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  }
  requestAnimationFrame(tick);
}

function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => observer.observe(el));
}

function initParticles(container, count = 24) {
  if (!container) return;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 3 + 1.5;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.bottom = `-10px`;
    p.style.animationDuration = `${Math.random() * 14 + 10}s`;
    p.style.animationDelay = `${Math.random() * 10}s`;
    if (Math.random() > 0.5) p.style.background = 'var(--neon-green)';
    container.appendChild(p);
  }
}
