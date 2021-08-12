const express = require('express');
const appealRouter = require('./appeal');
const apiDocsRouter = require('./api-docs');

const router = express.Router();

router.use('/api/v1/appeal', appealRouter);
router.use('/api-docs', apiDocsRouter);

module.exports = router;
