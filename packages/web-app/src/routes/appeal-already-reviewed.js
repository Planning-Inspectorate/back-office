const express = require('express');
const { getAppealAlreadyReviewed } = require('../controllers/appeal-already-reviewed');

const router = express.Router();

router.get('/', getAppealAlreadyReviewed);

module.exports = router;
