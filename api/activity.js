const supabase = require('../lib/supabase');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;

    res.json(data.map(a => ({
      nickname: a.nickname,
      message: a.message,
      timestamp: a.created_at
    })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memuat activity feed.' });
  }
};
