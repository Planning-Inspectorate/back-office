import { matchedData } from 'express-validator';

/**
 * @type {import('express').RequestHandler}
 */
export const trimUnexpectedRequestParameters = async (request, _response, next) => {
	request.params = matchedData(request, { locations: ['params'] });
	request.body = matchedData(request, { locations: ['body'] });
	request.query = matchedData(request, { locations: ['query'] });
	next();
};
