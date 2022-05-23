import * as authSession from './auth-session.service.js';

/** @type {import('express').RequestHandler} */
export const registerAuthLocals = ({ session }, res, next) => {
	res.locals.isAuthenticated = Boolean(authSession.getAccount(session));
	next();
};

/** @type {import('express').RequestHandler} */
export const clearAuthenticationData = ({ session }, _, next) => {
	authSession.destroyAuthenticationData(session);
	next();
};
