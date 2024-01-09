import { ERROR_NOT_FOUND } from '#endpoints/constants.js';
import { databaseConnector } from '#utils/database-connector.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */
/** @typedef {import('express').NextFunction} NextFunction */

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<Response | void>}
 */
export const loadAllAppealTypesAndAddToRequest = async (req, res, next) => {
	const allAppealTypes = await databaseConnector.appealType.findMany();
	req.appealTypes = allAppealTypes;
	next();
};

/**
 * @type {import("express").RequestHandler}
 * @returns {Promise<object|void>}
 */
export const validateAppealType = async (req, res, next) => {
	const { newAppealTypeId } = req.body;
	const match =
		req.appealTypes.findIndex((appealType) => appealType.id === Number(newAppealTypeId)) > -1;
	if (!match) {
		return res.status(400).send({ errors: { newAppealTypeId: ERROR_NOT_FOUND } });
	}
	next();
};
