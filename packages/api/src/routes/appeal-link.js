const express = require('express');
const { postAppealLink } = require('../controllers/appeal-link');

const router = express.Router();

router.post('/', postAppealLink);

module.exports = router;
