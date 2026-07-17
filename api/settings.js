module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  res.json({
    clanName: 'LORD',
    tagline: 'Community Portal untuk Pemain Game Sepak Bola Online 4vs4',
    founded: '2024',
    rules: [
      'Hormati sesama anggota squad.',
      'Wajib hadir tepat waktu saat jadwal mabar.',
      'Dilarang toxic, judi, atau spam promosi di luar topik komunitas.',
      'Gunakan nama sesuai game ID agar mudah dikenali.'
    ]
  });
};
