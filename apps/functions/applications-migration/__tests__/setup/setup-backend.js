// @ts-nocheck
import { setupStaticData } from './setup-static-data.js';
import { startApi } from './start-api.js';
import { startDb, stopDb } from './start-db.js';
import kill from 'tree-kill';

let apiProcess;
// eslint-disable-next-line no-undef
beforeAll(async () => {
	try {
		startDb();
		apiProcess = await startApi();
		await setupStaticData();
		console.log('API started successfully');
	} catch (error) {
		console.error('Failed to setup backend', error);
		process.exit(1);
	}
});

// eslint-disable-next-line no-undef
afterAll(async () => {
	if (apiProcess) {
		await new Promise((resolve, reject) => {
			kill(apiProcess.pid, 'SIGTERM', (err) => {
				if (err) {
					console.error(`Failed to kill API process: ${err}`);
					reject(err);
				}
				resolve(null);
			});
		});
	}
	stopDb();
});
