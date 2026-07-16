const readJson = require('../utils/readJson');
const writeJson = require('../utils/writeJson');
const generateMemberId = require('../utils/generateMemberId');
const generateAvatar = require('../utils/avatarGenerator');
const generateQRCode = require('../utils/generateQRCode');
const generateIdCard = require('../utils/idCardGenerator');
const { formatDate } = require('../utils/formatDate');
const config = require('../config/config');

async function registerMember(req, res, next) {
  try {
    const { fullName, age, gameId, username, position, whatsapp } = req.body;

    const cleanFullName = fullName.trim();
    const cleanGameId = gameId.trim();
    const cleanUsername = username.trim();
    const cleanWhatsapp = whatsapp.trim();
    const ageNum = parseInt(age, 10);

    const members = readJson(config.DB_PATH.members);
    const activities = readJson(config.DB_PATH.activities);
    const stats = readJson(config.DB_PATH.stats);

    const usernameTaken = members.some(
      m => m.username.toLowerCase() === cleanUsername.toLowerCase()
    );
    if (usernameTaken) {
      return res.status(409).json({
        error: 'Username sudah dipakai anggota lain. Coba username lain.'
      });
    }

    const gameIdTaken = members.some(
      m => m.gameId.toLowerCase() === cleanGameId.toLowerCase()
    );
    if (gameIdTaken) {
      return res.status(409).json({
        error: 'ID Game ini sudah terdaftar sebagai anggota lain.'
      });
    }

    const memberId = generateMemberId(members);
    const joinDate = formatDate();
    const avatar = generateAvatar(cleanUsername);
    const qrCode = await generateQRCode(memberId);

    const newMember = {
      id: Date.now().toString(),
      memberId,
      fullName: cleanFullName,
      age: ageNum,
      gameId: cleanGameId,
      username: cleanUsername,
      nickname: cleanUsername,
      position,
      whatsapp: cleanWhatsapp,
      joinDate,
      avatar,
      qrCode,
      status: 'online',
      role: 'Member',
      matches: 0,
      winRate: 0
    };

    members.push(newMember);
    writeJson(config.DB_PATH.members, members);

    activities.unshift({
      id: Date.now().toString(),
      nickname: cleanUsername,
      position,
      action: 'join',
      timestamp: new Date().toISOString()
    });
    writeJson(config.DB_PATH.activities, activities);

    stats.totalMembers += 1;
    stats.newMembersToday += 1;
    stats.onlineMembers += 1;
    stats.activityToday += 1;
    stats.positionCount[position] += 1;
    writeJson(config.DB_PATH.stats, stats);

    res.status(201).json({
      message: 'Selamat datang di LORD!',
      member: newMember,
      idCard: generateIdCard(newMember)
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { registerMember };
