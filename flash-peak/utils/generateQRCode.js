const QRCode = require('qrcode');

async function generateQRCode(text) {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      margin: 1,
      width: 240,
      color: {
        dark: '#0F172A',
        light: '#F8FAFC'
      }
    });
    return dataUrl;
  } catch (err) {
    throw new Error('Gagal membuat QR Code untuk ID Card');
  }
}

module.exports = generateQRCode;
