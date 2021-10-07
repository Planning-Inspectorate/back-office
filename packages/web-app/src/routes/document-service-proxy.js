const express = require('express');
const documentServiceProxyController = require('../controllers/document-service-proxy');
const ensureAppealMatchesSessionMiddleware = require('../middleware/ensure-appeal-matches-session');

const router = express.Router();

router.get(
  '/:appealId/:documentId',
  [ensureAppealMatchesSessionMiddleware],
  documentServiceProxyController.getDocument
);

module.exports = router;
