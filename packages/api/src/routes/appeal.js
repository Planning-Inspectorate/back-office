const express = require('express');
const { getAllAppeals, getOneAppeal, postAppeal } = require('../controllers/appeal');

const router = express.Router();

router.get('/', getAllAppeals);
router.get('/:appealId', getOneAppeal);
router.post('/', postAppeal);

module.exports = router;
