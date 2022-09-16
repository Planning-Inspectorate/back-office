import config from '@pins/web/environment/config.js';
import session from 'express-session';

export const store = new session.MemoryStore();

// TODO: Regeneration of Session After Login
export default session({
	secret: 'PINSBackOffice',
	resave: false,
	saveUninitialized: false,
	store,
	unset: 'destroy',
	cookie: {
		secure: config.isProduction,
		maxAge: 86_400_000
	}
});
