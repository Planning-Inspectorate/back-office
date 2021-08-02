const express = require('express');
const appealsList = require('./appeals-list');
const home = require('./home');

const router = express.Router();

router.use('/', appealsList);
router.use('/', home);

module.exports = router;
