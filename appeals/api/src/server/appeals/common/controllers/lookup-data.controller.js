import appealRepository from '../../../repositories/appeal.repository.js';
import logger from '../../../utils/logger.js';
import { ERROR_FAILED_TO_GET_DATA, ERROR_NOT_FOUND } from '../../constants.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * @param {string} databaseTable
 * @returns {() => Promise<object | void>}
 */
const getLookupData =
	(databaseTable) => async (/** @type {Request} */ req, /** @type {Response} */ res) => {
		try {
			const lookupData = await appealRepository.getLookupList(databaseTable);

			if (!lookupData.length) {
				return res.status(404).send({ errors: ERROR_NOT_FOUND });
			}

			return res.send(lookupData);
		} catch (error) {
			logger.error(error);
			return res.status(500).send({ errors: ERROR_FAILED_TO_GET_DATA });
		}
	};

export { getLookupData };
