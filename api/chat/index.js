const supabase = require('../../lib/supabase');

const ADMIN_NAME = 'Admin Komunitas Lord';

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { data: chats, error } = await supabase
      .from('chats').select('*').order('updated_at', { ascending: false });
    if (error) throw error;

    const conversations = await Promise.all(chats.map(async (c) => {
      const { data: last } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', c.conversation_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      return {
        conversationId: c.conversation_id,
        visitorName: c.visitor_name,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
        status: c.status,
        adminUnread: c.admin_unread || 0,
        lastMessage: last ? { sender: last.sender, text: last.text, timestamp: last.created_at } : null
      };
    }));

    res.json({ adminName: ADMIN_NAME, conversations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Gagal memuat daftar chat.' });
  }
};
