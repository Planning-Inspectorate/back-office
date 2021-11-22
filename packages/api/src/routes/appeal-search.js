const express = require('express');
const { appealSearch } = require('../controllers/appeal-search');

const router = express.Router();

router.get('/:searchString', appealSearch);

module.exports = router;
