const express = require('express');
const documentServiceProxyController = require('../controllers/document-service-proxy');

const router = express.Router();

router.get('/:appealId/:documentId', documentServiceProxyController.getDocument);

module.exports = router;
