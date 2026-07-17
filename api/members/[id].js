const supabase = require('../../lib/supabase');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { id } = req.query;
    const { data: m, error } = await supabase.from('members').select('*').eq('member_id', id).single();
    if (error || !m) return res.status(404).json({ error: 'Anggota tidak ditemukan.' });

    res.json({
      memberId: m.member_id,
      username: m.username,
      gameId: m.game_id,
      position: m.position,
      whatsapp: m.whatsapp,
      status: m.status,
      avatar: m.avatar_url,
      qrCode: m.qr_code,
      joinDate: m.join_date
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memuat data anggota.' });
  }
};
