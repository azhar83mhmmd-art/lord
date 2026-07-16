const path = require('path');

module.exports = {
  PORT: process.env.PORT || 4334,
  CLAN_NAME: 'LORD',
  DB_PATH: {
    members: path.join(__dirname, '..', 'database', 'members.json'),
    activities: path.join(__dirname, '..', 'database', 'activities.json'),
    stats: path.join(__dirname, '..', 'database', 'stats.json'),
    settings: path.join(__dirname, '..', 'database', 'settings.json')
  },
  POSITIONS: ['CB', 'CM', 'WF', 'ST'],
  POSITION_LABELS: {
    CB: 'Center Back',
    CM: 'Center Midfielder',
    WF: 'Wing Forward',
    ST: 'Striker'
  }
};
