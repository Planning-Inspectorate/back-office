import appInsights from 'applicationinsights';
import config from '@pins/applications.web/environment/config.js';
import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import { app } from './app/app.express.js';
import pino from './lib/logger.js';
import { initialiseRedis } from './lib/redis.js';

if (config.appInsightsConnectionString) {
	try {
		appInsights
			.setup(config.appInsightsConnectionString)
			.setAutoCollectConsole(true, true)
			.setSendLiveMetrics(true)
			.start();
	} catch (err) {
		pino.warn({ err }, 'Application insights failed to start: ');
	}
} else {
	pino.warn(
		'Skipped initialising Application Insights because `APPLICATIONINSIGHTS_CONNECTION_STRING` is undefined. If running locally, this is expected.'
	);
}

if (config.session.redis) {
	initialiseRedis(config.session.redis);
} else {
	pino.warn('Skipped initialising Redis because no connection string was provided.');
}

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
