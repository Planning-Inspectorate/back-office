import NotifyClient from '../utils/notify-client.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */
/** @typedef {import('express').NextFunction} NextFunction */

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {void}
 */
const initNotifyClientAndAddToRequest = (req, res, next) => {
	req.notifyClient = new NotifyClient();
	next();
};

export default initNotifyClientAndAddToRequest;
