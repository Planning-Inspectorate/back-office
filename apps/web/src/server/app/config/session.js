import config from '@pins/applications.web/environment/config.js';
import session from 'express-session';

export const store = new session.MemoryStore();

export default session({
	secret: config.sessionSecret,
	resave: false,
	saveUninitialized: false,
	store,
	unset: 'destroy',
	cookie: {
		secure: config.isProduction,
		maxAge: 86_400_000
	}
});
