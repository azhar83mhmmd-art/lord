const supabase = require('../../lib/supabase');

const ADMIN_NAME = 'Admin Komunitas Lord';

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { visitorName } = req.body || {};
    const { data: convo, error } = await supabase
      .from('chats')
      .insert({ visitor_name: (visitorName && visitorName.trim()) || 'Pengunjung' })
      .select()
      .single();
    if (error) throw error;

    const { data: welcomeMsg, error: msgErr } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: convo.conversation_id,
        sender: 'admin',
        sender_name: ADMIN_NAME,
        text: 'Halo! Ada yang bisa dibantu seputar LORD? Tulis pesanmu di sini, admin akan segera membalas.',
        read: true
      })
      .select()
      .single();
    if (msgErr) throw msgErr;

    res.status(201).json({
      conversationId: convo.conversation_id,
      visitorName: convo.visitor_name,
      status: convo.status,
      messages: [welcomeMsg]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memulai percakapan.' });
  }
};
