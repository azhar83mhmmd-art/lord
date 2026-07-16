const readJson = require('../utils/readJson');
const generateIdCard = require('../utils/idCardGenerator');
const config = require('../config/config');

function getAllMembers(req, res, next) {
  try {
    const members = readJson(config.DB_PATH.members);
    const { position, search } = req.query;

    let result = members;

    if (position && config.POSITIONS.includes(position)) {
      result = result.filter(m => m.position === position);
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(m => m.nickname.toLowerCase().includes(q));
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}

function getMemberById(req, res, next) {
  try {
    const members = readJson(config.DB_PATH.members);
    const member = members.find(m => m.memberId === req.params.id);

    if (!member) {
      return res.status(404).json({ error: 'Anggota tidak ditemukan.' });
    }

    res.json(member);
  } catch (err) {
    next(err);
  }
}

function getMemberIdCard(req, res, next) {
  try {
    const members = readJson(config.DB_PATH.members);
    const member = members.find(m => m.memberId === req.params.id);

    if (!member) {
      return res.status(404).json({ error: 'Anggota tidak ditemukan.' });
    }

    res.json(generateIdCard(member));
  } catch (err) {
    next(err);
  }
}

function getTopPlayers(req, res, next) {
  try {
    const members = readJson(config.DB_PATH.members);
    const sorted = [...members].sort((a, b) => (b.winRate || 0) - (a.winRate || 0));
    res.json(sorted.slice(0, 10));
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllMembers, getMemberById, getMemberIdCard, getTopPlayers };
