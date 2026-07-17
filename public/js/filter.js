/* Generic filter-chip wiring. Chips share a container; clicking one
   sets it active (others inactive) and calls the callback with its
   [data-value], or null if the chip represents "all". */

function wireFilterChips(containerEl, onChange) {
  if (!containerEl) return;
  containerEl.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    containerEl.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const value = chip.dataset.value || null;
    onChange(value === 'all' ? null : value);
  });
}
