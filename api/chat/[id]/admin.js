const supabase = require('../../../lib/supabase');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { id } = req.query;
    const { data: convo, error } = await supabase.from('chats').select('*').eq('conversation_id', id).single();
    if (error || !convo) return res.status(404).json({ error: 'Percakapan tidak ditemukan.' });

    const { data: messages } = await supabase
      .from('chat_messages').select('*').eq('conversation_id', id).order('created_at', { ascending: true });

    await supabase.from('chats').update({ admin_unread: 0 }).eq('conversation_id', id);
    await supabase.from('chat_messages').update({ read: true })
      .eq('conversation_id', id).eq('sender', 'visitor');

    res.json({
      conversationId: convo.conversation_id,
      visitorName: convo.visitor_name,
      status: convo.status,
      messages: messages.map(m => ({
        id: m.id, sender: m.sender, senderName: m.sender_name, text: m.text, timestamp: m.created_at
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memuat percakapan.' });
  }
};
