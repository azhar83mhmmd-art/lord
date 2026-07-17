const supabase = require('../lib/supabase');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { position, q } = req.query;
    let query = supabase.from('members').select('*').order('join_date', { ascending: false });

    if (position) query = query.eq('position', position);
    if (q) query = query.ilike('username', `%${q}%`);

    const { data, error } = await query;
    if (error) throw error;

    res.json(data.map(m => ({
      memberId: m.member_id,
      nickname: m.username,
      username: m.username,
      gameId: m.game_id,
      whatsapp: m.whatsapp,
      position: m.position,
      status: m.status,
      avatar: m.avatar_url,
      joinDate: m.join_date
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memuat anggota.' });
  }
};
