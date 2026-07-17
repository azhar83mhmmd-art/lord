const supabase = require('../../lib/supabase');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { count: totalMembers } = await supabase.from('members').select('*', { count: 'exact', head: true });
    const { data: stats } = await supabase.from('stats').select('*').eq('id', 1).single();
    const { data: activities } = await supabase
      .from('activities').select('*').order('created_at', { ascending: false }).limit(10);

    res.json({
      totalMembers,
      stats: {
        totalMembers: stats.total_members,
        onlineMembers: stats.online_members,
        newMembersToday: stats.new_members_today,
        activityToday: stats.activity_today,
        positionCount: { CB: stats.cb_count, CM: stats.cm_count, WF: stats.wf_count, ST: stats.st_count }
      },
      recentActivity: activities.map(a => ({ nickname: a.nickname, message: a.message, timestamp: a.created_at }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memuat data admin.' });
  }
};
