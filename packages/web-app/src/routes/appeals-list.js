const express = require('express');
const getAppealsList = require('../controllers/appeals-list');

const router = express.Router();

router.get('/', getAppealsList);

module.exports = router;
