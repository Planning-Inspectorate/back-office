const express = require('express');
const { getReviewComplete } = require('../controllers/review-complete');

const router = express.Router();

router.get('/', getReviewComplete);

module.exports = router;
