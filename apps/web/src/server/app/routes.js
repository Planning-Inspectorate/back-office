'use strict';

const express = require('express');
const appRoutes = require('./app.route');

const router = express.Router();

// GET /health-check - Check service health
router.get('/health-check', (req, res) =>
	res.send('OK')
);

router.use('/', appRoutes);

module.exports = {
	routes: router
};
