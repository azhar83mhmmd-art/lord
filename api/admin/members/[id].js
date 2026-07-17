const supabase = require('../../../lib/supabase');

module.exports = async (req, res) => {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { id } = req.query;
    const { data: target, error: findErr } = await supabase.from('members').select('*').eq('member_id', id).single();
    if (findErr || !target) return res.status(404).json({ error: 'Anggota tidak ditemukan.' });

    await supabase.from('members').delete().eq('member_id', id);

    const { data: stats } = await supabase.from('stats').select('*').eq('id', 1).single();
    const posKey = target.position.toLowerCase() + '_count';
    await supabase.from('stats').update({
      total_members: Math.max(0, stats.total_members - 1),
      [posKey]: Math.max(0, stats[posKey] - 1)
    }).eq('id', 1);

    res.json({ message: `Anggota ${target.username} berhasil dihapus.` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal menghapus anggota.' });
  }
};
