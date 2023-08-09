import commonRepository from '#repositories/common.repository.js';
import logger from '../../utils/logger.js';
import { ERROR_FAILED_TO_GET_DATA, ERROR_NOT_FOUND } from '../../endpoints/constants.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * @param {string} databaseTable
 * @returns {(req: Request, res: Response) => Promise<object | void>}
 */
const getLookupData = (databaseTable) => async (req, res) => {
	try {
		const lookupData = await commonRepository.getLookupList(databaseTable);

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
