import config from '@pins/web/environment/config.js';
import session from 'express-session';

export const store = new session.MemoryStore();

// TODO: Regeneration of Session After Login
// TODO: Set Expiration
export default session({
	secret: 'PINSBackOffice',
	resave: false,
	saveUninitialized: false,
	store,
	cookie: {
		secure: config.isProduction
	}
});
