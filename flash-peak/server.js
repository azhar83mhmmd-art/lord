const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const registerRoutes = require('./routes/register');
const memberRoutes = require('./routes/members');
const statsRoutes = require('./routes/stats');
const activityRoutes = require('./routes/activity');
const adminRoutes = require('./routes/admin');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');
const config = require('./config/config');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/register', registerRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/settings', (req, res, next) => {
  try {
    const readJson = require('./utils/readJson');
    res.json(readJson(config.DB_PATH.settings));
  } catch (err) {
    next(err);
  }
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`LORD server berjalan di http://localhost:${config.PORT}`);
});
