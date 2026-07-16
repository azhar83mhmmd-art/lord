/* Shared app shell logic: header, footer, particles, mobile nav.
   Runs on every page. */

const NAV_ITEMS = [
  { href: '/index.html', label: 'Home', icon: 'home' },
  { href: '/members.html', label: 'Community Feed', icon: 'member' },
  { href: '/leaderboard.html', label: 'Leaderboard', icon: 'leaderboard' },
  { href: '/schedule.html', label: 'Jadwal Mabar', icon: 'calendar' },
  { href: '/rules.html', label: 'Rules', icon: 'shield' }
];

function renderHeader(activePath) {
  const nav = document.getElementById('site-nav');
  if (!nav) return;
  nav.innerHTML = NAV_ITEMS.map(item => `
    <a href="${item.href}" class="${activePath === item.href ? 'active' : ''}">
      ${ICONS[item.icon]}
      <span>${item.label}</span>
    </a>
  `).join('');
}

function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  footer.innerHTML = `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <div class="brand">
            <img src="/assets/logo.svg" alt="" class="logo-mark">
            <span>LO<span class="accent">RD</span></span>
          </div>
          <p>Portal komunitas untuk pemain game sepak bola online 4vs4. Kumpul squad, pantau statistik, dan jangan lewatkan jadwal mabar.</p>
        </div>
        <div class="footer-col">
          <h4>Navigasi</h4>
          <a href="/index.html">Home</a>
          <a href="/members.html">Community Feed</a>
          <a href="/leaderboard.html">Leaderboard</a>
          <a href="/schedule.html">Jadwal Mabar</a>
        </div>
        <div class="footer-col">
          <h4>Komunitas</h4>
          <a href="/rules.html">Rules</a>
          <a href="/register.html">Join Squad</a>
          <a href="/about.html">Tentang Kami</a>
        </div>
        <div class="footer-col">
          <h4>Bantuan</h4>
          <a href="/rules.html#faq">FAQ</a>
          <a href="/about.html">Kontak</a>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; 2026 LORD Community. All rights reserved.</span>
        <span class="disclaimer">Portal komunitas gaming — bukan situs resmi klub sepak bola.</span>
      </div>
    </div>
  `;
}

function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('mobile-open');
    toggle.innerHTML = isOpen ? ICONS.close : ICONS.menu;
    if (isOpen) {
      nav.style.cssText = 'display:flex;flex-direction:column;position:absolute;top:var(--header-h);left:0;right:0;background:var(--bg-panel);padding:14px;border-bottom:1px solid var(--border-soft);';
    } else {
      nav.style.cssText = '';
    }
  });
}

function initApp(activePath) {
  renderHeader(activePath);
  renderFooter();
  initMobileNav();
  const particleField = document.querySelector('.particles');
  if (particleField) initParticles(particleField, 20);
  const toggle = document.getElementById('nav-toggle');
  if (toggle) toggle.innerHTML = ICONS.menu;
  document.querySelectorAll('[data-icon]').forEach(el => {
    const name = el.getAttribute('data-icon');
    if (ICONS[name]) el.innerHTML = ICONS[name];
  });
  initScrollReveal();
}
