const express = require('express');
const getAppealsList = require('../controllers/appeals-list');
const views = require('../config/views');

const router = express.Router();

router.get(`/${views.appealsList}`, getAppealsList);

module.exports = router;
