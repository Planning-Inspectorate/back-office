const express = require('express');
const { getAppeal, postAppeal, putAppeal, patchAppeal } = require('../controllers/appeal');

const router = express.Router();

router.get('/', getAppeal);
router.post('/', postAppeal);
router.put('/', putAppeal);
router.patch('/', patchAppeal);

module.exports = router;
