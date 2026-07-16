const readJson = require('../utils/readJson');
const config = require('../config/config');

function getActivities(req, res, next) {
  try {
    const activities = readJson(config.DB_PATH.activities);
    const limit = parseInt(req.query.limit, 10) || 50;
    res.json(activities.slice(0, limit));
  } catch (err) {
    next(err);
  }
}

module.exports = { getActivities };
