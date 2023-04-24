// @ts-check

import appealRepository from '../../repositories/appeal.repository.js';
import appealFormatter from './appeals-formatter.js';

/** @typedef {import('./appeals.routes.js').AppealParams} AppealParams */

/**
 * @type {import('express').RequestHandler}
 */
const getAppeals = async (req, res) => {
	const appeals = await appealRepository.getAll();
	const formattedAppeals = appeals.map((appeal) => appealFormatter.formatAppeals(appeal));

	res.send(formattedAppeals);
};

export { getAppeals };
