const express = require('express');
const router = express.Router();
const { registerMember } = require('../controllers/registerController');
const validateRegister = require('../middleware/validate');

router.post('/', validateRegister, registerMember);

module.exports = router;
