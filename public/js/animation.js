/* Orchestrates page-load motion. Scroll reveal is initialized from
   initApp() in app.js via initScrollReveal() (utils.js). This file
   re-runs the observer after dynamic content injects new .reveal
   nodes, since MutationObserver keeps things simple across pages. */

document.addEventListener('DOMContentLoaded', () => {
  const target = document.querySelector('main') || document.body;
  const mo = new MutationObserver(() => initScrollReveal());
  mo.observe(target, { childList: true, subtree: true });
});
