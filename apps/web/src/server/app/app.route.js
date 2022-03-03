'use strict';

const express = require('express');

const router = express.Router();

router.route('/')
	.get((request, response) => {
		response.render('home');
	});

router.route('/test')
	.get((request, response) => {
		response.send('<p>some html</p>');
	});

module.exports = router;
