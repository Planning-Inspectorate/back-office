const express = require('express');

const router = express.Router();

const documentServiceProxyController = require('../controllers/document-service-proxy');
const ensureAppealMatchesSessionMiddleware = require('../middleware/ensure-appeal-matches-session');

router.get(
  '/:appealId/:documentId',
  [ensureAppealMatchesSessionMiddleware],
  documentServiceProxyController.getDocument
);

module.exports = router;
