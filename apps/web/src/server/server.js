import config from '@pins/web/environment/config.js';
import kleur from 'kleur';
import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import { app } from './app/app.express.js';

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
		console.log(
			'%s Server is running at http://localhost:%d in %s mode',
			kleur.green('✓'),
			app.get('http-port'),
			app.get('env')
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
			console.log(
				'%s Server is running at https://localhost:%d in %s mode',
				kleur.green('✓'),
				app.get('https-port'),
				app.get('env')
			);
		});
}
