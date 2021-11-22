const express = require('express');
const { getAppealDetails } = require('../controllers/appeal-details');

const router = express.Router();

router.get('/', getAppealDetails);

module.exports = router;
