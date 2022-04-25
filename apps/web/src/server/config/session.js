import session from 'express-session';

// TODO: Regeneration of Session After Login
// TODO: Set Expiration

export default session({
	secret: 'PINSBackOffice',
	resave: false,
	saveUninitialized: true,
	cookie: {
		secure: process.env.NODE_ENV === 'production'
	}
});
