import config from '@pins/appeals.web/environment/config.js';
import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import { app } from './app/app.express.js';
import pino from './lib/logger.js';

// Trust X-Forwarded-* headers so that when we are behind a reverse proxy,
// our connection information is that of the original client (according to
// the proxy), not of the proxy itself. We need this for HTTPS redirection
// and bot rendering.
app.set('trust proxy', true);

// Set the ETag response header.
app.set('etag', 'weak');

// Express http/s ports
if (config.serverProtocol === 'http') {
	app.set('http-port', config.serverPort);

	app.listen(app.get('http-port'), () => {
		pino.info(
			`Server is running at http://localhost:${app.get('http-port')} in ${app.get('env')} mode`
		);
	});
}

if (config.serverProtocol === 'https') {
	app.set('https-port', config.serverPort);

	https
		.createServer(
			{
				cert: fs.readFileSync(path.resolve(config.sslCertificateFile)),
				key: fs.readFileSync(path.resolve(config.sslCertificateKeyFile))
			},
			app
		)
		.listen(app.get('https-port'), () => {
			pino.info(
				`Server is running at https://localhost:${app.get('https-port')} in ${app.get('env')} mode`
			);
		});
}
