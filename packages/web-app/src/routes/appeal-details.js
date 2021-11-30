const express = require('express');
const { getAppealDetails } = require('../controllers/appeal-details');
const getCaseData = require('../lib/get-case-data');

const router = express.Router();

const appellantRouter = require('./appeal-details/appellant');

router.use('/:appealId/appellant', getCaseData, appellantRouter);
router.use('/:appealId', getCaseData, getAppealDetails);

module.exports = router;
