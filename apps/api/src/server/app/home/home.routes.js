'use strict';

const {getHome} = require("./home.controller");
const express = require('express');
const router = express.Router();

router.get('/', getHome);

module.exports.homeRoutes = router;
