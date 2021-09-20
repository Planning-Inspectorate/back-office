const fetch = require('node-fetch');
const uuid = require('uuid');
const { utils } = require('@pins/common');

const config = require('../config/config');
const parentLogger = require('./logger');

async function handler(path, method = 'GET', opts = {}, headers = {}) {
  const correlationId = uuid.v4();
  const url = `${config.documents.url}${path}`;

  const logger = parentLogger.child({
    correlationId,
    service: 'Documents Service API',
  });

  try {
    logger.debug({ url, method, opts, headers }, 'Fetching document from Blob Storage');

    return await utils.promiseTimeout(
      config.documents.timeout,
      Promise.resolve().then(async () => {
        const apiResponse = await fetch(url, {
          method,
          headers: {
            'X-Correlation-ID': correlationId,
            ...headers,
          },
          ...opts,
        });

        if (!apiResponse.ok) {
          logger.debug(apiResponse, 'Failed to fetch document from Blob Storage');
          try {
            const errorResponse = await apiResponse.json();
            /* istanbul ignore else */
            if (errorResponse.errors && errorResponse.errors.length) {
              throw new Error(errorResponse.errors.join('\n'));
            }

            /* istanbul ignore next */
            throw new Error(apiResponse.statusText);
          } catch (e) {
            logger.error({ e }, 'Error on documents API wrapper handler.');
            throw new Error(e.message);
          }
        }

        logger.debug('Fetching document from Blob Storage is successfull');

        return apiResponse;
      })
    );
  } catch (err) {
    logger.error({ err }, 'Error');
    throw err;
  }
}

exports.getDocument = async (appealId, documentId) =>
  handler(`/api/v1/${appealId}/${documentId}/file`);
