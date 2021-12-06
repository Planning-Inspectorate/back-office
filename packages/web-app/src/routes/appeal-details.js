const express = require('express');
const { getAppealDetails } = require('../controllers/appeal-details');
const getCaseData = require('../lib/get-case-data');

const router = express.Router();

const appellantRouter = require('./appeal-details/appellant');
const caseOfficerRouter = require('./appeal-details/case-officer');
const applicationDecisionDateRouter = require('./appeal-details/application-decision-date');
const siteAddressRouter = require('./appeal-details/site-address');

router.use('/:appealId/site-address', getCaseData, siteAddressRouter);
router.use('/:appealId/application-decision-date', getCaseData, applicationDecisionDateRouter);
router.use('/:appealId/appellant', getCaseData, appellantRouter);
router.use('/:appealId/case-officer', getCaseData, caseOfficerRouter);
router.use('/:appealId', getCaseData, getAppealDetails);

module.exports = router;
