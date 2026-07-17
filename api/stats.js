const supabase = require('../lib/supabase');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { data, error } = await supabase.from('stats').select('*').eq('id', 1).single();
    if (error) throw error;

    res.json({
      totalMembers: data.total_members,
      onlineMembers: data.online_members,
      newMembersToday: data.new_members_today,
      activityToday: data.activity_today,
      positionCount: {
        CB: data.cb_count,
        CM: data.cm_count,
        WF: data.wf_count,
        ST: data.st_count
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memuat statistik.' });
  }
};
