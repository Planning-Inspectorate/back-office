import config from '@pins/web/environment/config.js';
import session from 'express-session';
import { env } from 'node:process';

export const store = new session.MemoryStore();

/**
 * @param {string} sessionSecret
 */
const sessionSecret = env.SESSION_SECRET || '';

export default session({
	secret: sessionSecret,
	resave: false,
	saveUninitialized: false,
	store,
	unset: 'destroy',
	cookie: {
		secure: config.isProduction,
		maxAge: 86_400_000
	}
});
