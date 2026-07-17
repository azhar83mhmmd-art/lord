const supabase = require('../../lib/supabase');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('join_date', { ascending: true })
      .limit(10);
    if (error) throw error;

    res.json(data.map(m => ({
      memberId: m.member_id,
      username: m.username,
      position: m.position,
      avatar: m.avatar_url
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memuat top player.' });
  }
};
