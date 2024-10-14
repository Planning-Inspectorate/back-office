// @ts-nocheck
/* eslint-disable no-undef */
import { startApi } from './start-api.js';
import kill from 'tree-kill';

let apiProcess;
beforeAll(async () => {
	try {
		apiProcess = await startApi(); // Wait for the API to be fully started before running tests
		console.log('API started successfully');
	} catch (error) {
		console.error('Failed to start API', error);
		process.exit(1); // Exit if the API fails to start
	}
});

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
});
