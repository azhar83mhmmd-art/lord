const config = require('../config/config');

const WA_REGEX = /^[0-9+\-\s]{8,16}$/;

function validateRegister(req, res, next) {
  const { fullName, age, gameId, username, position, whatsapp } = req.body;

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 3) {
    return res.status(400).json({
      error: 'Nama lengkap minimal 3 karakter.'
    });
  }
  if (fullName.trim().length > 40) {
    return res.status(400).json({ error: 'Nama lengkap maksimal 40 karakter.' });
  }

  const ageNum = parseInt(age, 10);
  if (!age || isNaN(ageNum) || ageNum < 10 || ageNum > 80) {
    return res.status(400).json({
      error: 'Usia tidak valid. Masukkan usia antara 10-80 tahun.'
    });
  }

  if (!gameId || typeof gameId !== 'string' || gameId.trim().length < 3) {
    return res.status(400).json({
      error: 'ID game minimal 3 karakter.'
    });
  }
  if (gameId.trim().length > 30) {
    return res.status(400).json({ error: 'ID game maksimal 30 karakter.' });
  }

  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    return res.status(400).json({
      error: 'Username minimal 3 karakter. Ini yang akan tampil di ID Card dan Community Feed.'
    });
  }
  if (username.trim().length > 20) {
    return res.status(400).json({ error: 'Username maksimal 20 karakter.' });
  }

  if (!position || !config.POSITIONS.includes(position)) {
    return res.status(400).json({
      error: 'Posisi tidak valid. Pilih salah satu: CB, CM, WF, atau ST.'
    });
  }

  if (!whatsapp || typeof whatsapp !== 'string' || !WA_REGEX.test(whatsapp.trim())) {
    return res.status(400).json({
      error: 'Nomor WhatsApp tidak valid. Contoh: 081234567890.'
    });
  }

  next();
}

module.exports = validateRegister;
