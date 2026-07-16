const { formatDisplayDate } = require('./formatDate');

/* The ID Card is meant to be downloaded and shared in group chats,
   so it intentionally excludes private contact info (WhatsApp number,
   full legal name, age) — only the public gaming identity is printed. */
function generateIdCard(member) {
  return {
    username: member.username || member.nickname,
    memberId: member.memberId,
    gameId: member.gameId,
    position: member.position,
    joinDate: formatDisplayDate(member.joinDate),
    avatar: member.avatar,
    qrCode: member.qrCode,
    logo: '/assets/logo.svg'
  };
}

module.exports = generateIdCard;
