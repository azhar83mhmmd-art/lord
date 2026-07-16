const express = require('express');
const router = express.Router();
const readJson = require('../utils/readJson');
const writeJson = require('../utils/writeJson');
const config = require('../config/config');

router.get('/overview', (req, res, next) => {
  try {
    const members = readJson(config.DB_PATH.members);
    const stats = readJson(config.DB_PATH.stats);
    const activities = readJson(config.DB_PATH.activities);
    res.json({
      totalMembers: members.length,
      stats,
      recentActivity: activities.slice(0, 10)
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/members/:id', (req, res, next) => {
  try {
    const members = readJson(config.DB_PATH.members);
    const target = members.find(m => m.memberId === req.params.id);

    if (!target) {
      return res.status(404).json({ error: 'Anggota tidak ditemukan.' });
    }

    const filtered = members.filter(m => m.memberId !== req.params.id);
    writeJson(config.DB_PATH.members, filtered);

    const stats = readJson(config.DB_PATH.stats);
    stats.totalMembers = Math.max(0, stats.totalMembers - 1);
    if (stats.positionCount[target.position] > 0) {
      stats.positionCount[target.position] -= 1;
    }
    writeJson(config.DB_PATH.stats, stats);

    res.json({ message: `Anggota ${target.nickname} berhasil dihapus.` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
