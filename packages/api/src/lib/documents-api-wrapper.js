const fetch = require('node-fetch');
const config = require('../config');
const ApiError = require('./api-error');
const logger = require('./logger');

const { url } = config.documents;

const getDocumentsMetadata = async (appealId) => {
  try {
    const apiResponse = await fetch(`${url}/api/v1/${appealId}`);

    if (apiResponse.ok) {
      const documents = await apiResponse.json();
      return documents.map(({ metadata }) => metadata);
    }

    return null;
  } catch (err) {
    throw new ApiError(`Failed to get documents - ${err.toString()}`);
  }
};

const uploadDocument = async (appealOrQuestionnaireId, body) => {
  try {
    const apiResponse = await fetch(`${url}/api/v1/${appealOrQuestionnaireId}`, {
      method: 'POST',
      body,
    });

    if (apiResponse.ok) {
      return true;
    }

    logger.error({ error: apiResponse.statusText }, 'Failed to upload document');
    return false;
  } catch (err) {
    throw new ApiError(`Failed to upload document - ${err.toString()}`);
  }
};

module.exports = {
  getDocumentsMetadata,
  uploadDocument,
};
