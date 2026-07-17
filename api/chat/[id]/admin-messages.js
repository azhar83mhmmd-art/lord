const supabase = require('../../../lib/supabase');

const ADMIN_NAME = 'Admin Komunitas Lord';

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { id } = req.query;
    const { text } = req.body || {};
    if (!text || !text.trim()) return res.status(400).json({ error: 'Pesan tidak boleh kosong.' });

    const { data: convo, error: findErr } = await supabase.from('chats').select('*').eq('conversation_id', id).single();
    if (findErr || !convo) return res.status(404).json({ error: 'Percakapan tidak ditemukan.' });

    await supabase.from('chat_messages').insert({
      conversation_id: id,
      sender: 'admin',
      sender_name: ADMIN_NAME,
      text: text.trim().slice(0, 2000),
      read: true
    });

    await supabase.from('chats').update({
      updated_at: new Date().toISOString(),
      visitor_unread: (convo.visitor_unread || 0) + 1
    }).eq('conversation_id', id);

    const { data: messages } = await supabase
      .from('chat_messages').select('*').eq('conversation_id', id).order('created_at', { ascending: true });

    res.status(201).json({
      conversationId: id,
      messages: messages.map(m => ({
        id: m.id, sender: m.sender, senderName: m.sender_name, text: m.text, timestamp: m.created_at
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal mengirim balasan.' });
  }
};
