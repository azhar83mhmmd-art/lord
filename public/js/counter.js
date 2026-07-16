/* Counter animation is defined in utils.js (animateCounter).
   This file wires up any [data-counter] elements found in the DOM
   on pages that don't manually call animateCounter themselves. */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-counter]').forEach(el => {
    const target = parseInt(el.dataset.counter, 10);
    if (!isNaN(target)) animateCounter(el, target);
  });
});
