const express = require('express');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const getYamlAsJson = require('../lib/get-yaml-as-json');
const config = require('../config');

const {
  documentation: {
    api: { path: apiDocsPath },
  },
} = config;

const router = express.Router();
const file = getYamlAsJson(path.join(apiDocsPath, 'openapi.yaml'));

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(file));

module.exports = router;
