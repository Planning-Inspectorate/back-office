const express = require('express');
const { getAppealSearchResults } = require('../controllers/appeal-search-results');

const router = express.Router();

router.get('/:searchString', getAppealSearchResults);

module.exports = router;
