const readJson = require('../utils/readJson');
const config = require('../config/config');

function getStats(req, res, next) {
  try {
    const stats = readJson(config.DB_PATH.stats);
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats };
