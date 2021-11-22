const express = require('express');
const { getAppealSearch, postAppealSearch } = require('../controllers/appeal-search');

const router = express.Router();

router.get('/', getAppealSearch);
router.post('/', postAppealSearch);

module.exports = router;
