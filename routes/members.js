const express = require('express');
const router = express.Router();
const {
  getAllMembers,
  getMemberById,
  getMemberIdCard,
  getTopPlayers
} = require('../controllers/memberController');

router.get('/top', getTopPlayers);
router.get('/', getAllMembers);
router.get('/:id', getMemberById);
router.get('/:id/idcard', getMemberIdCard);

module.exports = router;
