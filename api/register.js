const supabase = require('../lib/supabase');
const QRCode = require('qrcode');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { fullName, age, gameId, username, position, whatsapp } = req.body;
    if (!fullName || !gameId || !username || !position) {
      return res.status(400).json({ error: 'Data tidak lengkap.' });
    }
    if (!['CB', 'CM', 'WF', 'ST'].includes(position)) {
      return res.status(400).json({ error: 'Posisi tidak valid.' });
    }

    const seed = encodeURIComponent(username.trim());
    const dicebearUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;

    const avatarRes = await fetch(dicebearUrl);
    const avatarSvg = await avatarRes.text();
    const avatarPath = `avatars/${username}-${Date.now()}.svg`;

    await supabase.storage.from('lord-assets').upload(avatarPath, avatarSvg, {
      contentType: 'image/svg+xml',
      upsert: true
    });
    const { data: avatarPublic } = supabase.storage.from('lord-assets').getPublicUrl(avatarPath);

    const { data: member, error } = await supabase
      .from('members')
      .insert({
        full_name: fullName,
        age,
        game_id: gameId,
        username,
        position,
        whatsapp,
        avatar_url: avatarPublic.publicUrl,
        status: 'online'
      })
      .select()
      .single();

    if (error) throw error;

    const qrDataUrl = await QRCode.toDataURL(member.member_id, {
      margin: 1,
      width: 240,
      color: { dark: '#0F172A', light: '#F8FAFC' }
    });
    await supabase.from('members').update({ qr_code: qrDataUrl }).eq('member_id', member.member_id);

    await supabase.from('activities').insert({
      nickname: username,
      message: `${username} bergabung sebagai ${position}`
    });

    const { data: stats } = await supabase.from('stats').select('*').eq('id', 1).single();
    const posKey = position.toLowerCase() + '_count';
    await supabase.from('stats').update({
      total_members: stats.total_members + 1,
      online_members: stats.online_members + 1,
      new_members_today: stats.new_members_today + 1,
      activity_today: stats.activity_today + 1,
      [posKey]: stats[posKey] + 1
    }).eq('id', 1);

    res.status(201).json({
      message: 'Selamat datang di LORD!',
      card: {
        memberId: member.member_id,
        username: member.username,
        gameId: member.game_id,
        position: member.position,
        avatar: avatarPublic.publicUrl,
        qrCode: qrDataUrl,
        joinDate: new Date(member.join_date).toLocaleDateString('id-ID', {
          day: '2-digit', month: 'short', year: 'numeric'
        })
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mendaftar. Coba lagi.' });
  }
};
