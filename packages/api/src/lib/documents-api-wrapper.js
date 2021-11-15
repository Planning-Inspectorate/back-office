const fetch = require('node-fetch');
const config = require('../config');
const ApiError = require('./api-error');

const getDocumentsMetadata = async (appealId) => {
  try {
    const { url } = config.documents;
    const apiResponse = await fetch(`${url}/api/v1/${appealId}`);

    if (apiResponse.ok) {
      const documents = await apiResponse.json();
      return documents.map(({ metadata }) => metadata);
    }

    return null;
  } catch (err) {
    // throw new ApiError(`Failed to get documents - ${err.toString()}`);
  }
};

module.exports = {
  getDocumentsMetadata,
};
