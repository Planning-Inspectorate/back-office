const express = require('express');

const router = express.Router();

const documentServiceProxyController = require('../controllers/document-service-proxy');

router.get('/:appealId/:documentId', documentServiceProxyController.getDocument);

module.exports = router;
