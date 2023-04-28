import appealRepository from '../../repositories/appeal.repository.js';
import appealFormatter from './appeals.formatter.js';

/** @typedef {import('./appeals.routes.js').AppealParams} AppealParams */

/**
 * @type {import('express').RequestHandler}
 * @returns {Promise<object>}
 */
const getAppeals = async (req, res) => {
	const appeals = await appealRepository.getAll();
	const formattedAppeals = appeals.map((appeal) => appealFormatter.formatAppeals(appeal));

	return res.send(formattedAppeals);
};

/**
 * @type {import('express').RequestHandler}
 * @returns {Promise<object>}
 */
const getAppealById = async (req, res) => {
	const {
		params: { appealId }
	} = req;
	const appeal = await appealRepository.getById(Number(appealId));

	if (!appeal) {
		return res.status(404).send({ errors: { appealId: `Appeal with id ${appealId} not found` } });
	}

	const formattedAppeal = appealFormatter.formatAppeal(appeal);

	return res.send(formattedAppeal);
};

export { getAppealById, getAppeals };
