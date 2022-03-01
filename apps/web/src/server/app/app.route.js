'use strict';

const express = require('express');

const router = express.Router();

router.route('/')
	.get((req, res) => {
		res.render('home');
	})

router.route('/test')
	.get((req, res) => {
		res.send('<p>some html</p>')
	});

module.exports = router;
