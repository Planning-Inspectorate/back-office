'use strict';

const { getValidation } = require('./validation.controller');
const express = require('express');
const router = express.Router();

router.get('/', getValidation);

module.exports = {
	validationRoutes: router
};
