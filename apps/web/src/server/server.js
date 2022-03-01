'use strict';

const fs = require('node:fs');
const path = require('node:path');
const https = require('node:https');
const kleur = require('kleur');
const { loadEnv } = require('./lib/load-env');

// Load .env files based on the rules defined in the docs
loadEnv(process.env.NODE_ENV);

// Express app
const { app } = require('./app/express');

// Trust X-Forwarded-* headers so that when we are behind a reverse proxy,
// our connection information is that of the original client (according to
// the proxy), not of the proxy itself. We need this for HTTPS redirection
// and bot rendering.
app.set('trust proxy', true);

// Express http/s ports
app.set('http-port', process.env.HTTP_PORT || 8080);
app.set('https-port', process.env.HTTPS_PORT || 8443);

const listener = app.listen(app.get('http-port'), () => {
	// eslint-disable-next-line no-console
	console.log('%s Server is running at http://localhost:%d in %s mode', kleur.green('✓'), listener.address().port, app.get('env'));
});

if (process.env.HTTPS_ENABLED === 'true') {
	https.createServer({
		cert: fs.readFileSync(path.resolve(__dirname, process.env.SSL_CERT_FILE)),
		key: fs.readFileSync(path.resolve(__dirname, process.env.SSL_KEY_FILE))
	}, app).listen(app.get('https-port'), () => {
		// eslint-disable-next-line no-console
		console.log('%s Server is running at https://localhost:%d in %s mode', kleur.green('✓'), app.get('https-port'), app.get('env'));
	});
}
