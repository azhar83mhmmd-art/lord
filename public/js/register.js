/* Join LORD Community — registration form logic. */

let selectedPosition = null;

function clearFormErrors() {
  ['fullname-error', 'age-error', 'gameid-error', 'username-error', 'position-error', 'whatsapp-error']
    .forEach(id => document.getElementById(id).classList.remove('show'));
}

function showFieldError(id, message) {
  const el = document.getElementById(id);
  el.textContent = message;
  el.classList.add('show');
}

function initRegisterForm() {
  const options = document.querySelectorAll('.position-option');
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedPosition = opt.dataset.position;
      document.getElementById('position-error').classList.remove('show');
    });
  });

  const form = document.getElementById('register-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearFormErrors();

    const fullName = document.getElementById('fullname-input').value.trim();
    const age = document.getElementById('age-input').value.trim();
    const gameId = document.getElementById('gameid-input').value.trim();
    const username = document.getElementById('username-input').value.trim();
    const whatsapp = document.getElementById('whatsapp-input').value.trim();

    let hasError = false;

    if (fullName.length < 3) {
      showFieldError('fullname-error', 'Nama lengkap minimal 3 karakter.');
      hasError = true;
    }

    const ageNum = parseInt(age, 10);
    if (!age || isNaN(ageNum) || ageNum < 10 || ageNum > 80) {
      showFieldError('age-error', 'Usia tidak valid (10-80 tahun).');
      hasError = true;
    }

    if (gameId.length < 3) {
      showFieldError('gameid-error', 'ID Game minimal 3 karakter.');
      hasError = true;
    }

    if (username.length < 3) {
      showFieldError('username-error', 'Username minimal 3 karakter.');
      hasError = true;
    }

    if (!selectedPosition) {
      showFieldError('position-error', 'Pilih salah satu posisi player.');
      hasError = true;
    }

    const waRegex = /^[0-9+\-\s]{8,16}$/;
    if (!whatsapp || !waRegex.test(whatsapp)) {
      showFieldError('whatsapp-error', 'Nomor WhatsApp tidak valid. Contoh: 081234567890.');
      hasError = true;
    }

    if (hasError) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Memproses...';

    try {
      const result = await API.register({ fullName, age: ageNum, gameId, username, position: selectedPosition, whatsapp });
      sessionStorage.setItem('fp_new_member', JSON.stringify(result.member));
      sessionStorage.setItem('fp_id_card', JSON.stringify(result.idCard));
      window.location.href = '/idcard.html';
    } catch (err) {
      showFieldError('username-error', err.message);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}
