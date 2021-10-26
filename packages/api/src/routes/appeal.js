const express = require('express');
const { getAppeal, postAppeal } = require('../controllers/appeal');

const router = express.Router();

router.get('/', getAppeal);
router.post('/', postAppeal);

module.exports = router;
