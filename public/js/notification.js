/* Minimal notification bell behavior — clears the alert dot on click. */

document.addEventListener('DOMContentLoaded', () => {
  const bell = document.querySelector('.icon-btn[title="Notifikasi"]');
  if (!bell) return;
  bell.addEventListener('click', () => {
    const dot = bell.querySelector('.dot');
    if (dot) dot.remove();
    showToast('Tidak ada notifikasi baru.');
  });
});
