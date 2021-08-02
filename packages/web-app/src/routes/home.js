const express = require('express');
const getHome = require('../controllers/home');
const views = require('../config/views');

const router = express.Router();

router.get(`/${views.home}`, getHome);

module.exports = router;
