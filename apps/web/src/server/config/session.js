import session from 'express-session';

export const store = new session.MemoryStore();

// TODO: Regeneration of Session After Login
// TODO: Set Expiration
export default session({
	secret: 'PINSBackOffice',
	resave: false,
	saveUninitialized: true,
	store,
	cookie: {
		secure: process.env.NODE_ENV === 'production'
	}
});
