import fs from 'fs';
import path from 'path';
import https from 'https';
import kleur from 'kleur';
import { config } from './config/config.js';
import { app } from './app/app.express.js'; // Express app

// Trust X-Forwarded-* headers so that when we are behind a reverse proxy,
// our connection information is that of the original client (according to
// the proxy), not of the proxy itself. We need this for HTTPS redirection
// and bot rendering.
app.set('trust proxy', true);

// Set the ETag response header.
app.set('etag', 'weak');

// Express http/s ports
app.set('http-port', config.HTTP_PORT);
app.set('https-port', config.HTTPS_PORT);

const listener = app.listen(app.get('http-port'), () => {
	// eslint-disable-next-line no-console
	console.log('%s Server is running at http://localhost:%d in %s mode', kleur.green('✓'), listener.address().port, app.get('env'));
});

if (config.HTTPS_ENABLED === 'true') {
	https.createServer({
		cert: fs.readFileSync(path.resolve(config.SSL_CERT_FILE)),
		key: fs.readFileSync(path.resolve(config.SSL_KEY_FILE))
	}, app).listen(app.get('https-port'), () => {
		// eslint-disable-next-line no-console
		console.log('%s Server is running at https://localhost:%d in %s mode', kleur.green('✓'), app.get('https-port'), app.get('env'));
	});
}
