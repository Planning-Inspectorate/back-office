// @ts-nocheck
/* eslint-disable no-undef */
import { spawn } from 'node:child_process';
import kill from 'tree-kill';

export const PORT = 3001;
let apiProcess;

const startApi = () => {
	return new Promise((resolve, reject) => {
		apiProcess = spawn('npm', ['run', 'api'], {
			env: {
				// need to pass in values of .env file of api

				...process.env,
				PORT: PORT
			},
			cwd: '../../../',
			stdio: ['pipe', 'pipe', 'pipe'],
			shell: true
		});

		apiProcess.stdout.on('data', (data) => {
			const output = data.toString();
			console.log(output);

			if (output.includes(`Server is live at http://localhost:${PORT}`)) {
				resolve(null);
			}
		});

		apiProcess.on('error', (error) => {
			console.error(`Error starting API: ${error}`);
			reject(error);
		});

		apiProcess.on('exit', (code, signal) => {
			if (signal !== 'SIGTERM') {
				console.error(`API process exited unintentionally with code ${code}`);
				reject(new Error(`API exited with code ${code}`));
			}
		});
	});
};

beforeAll(async () => {
	try {
		await startApi(); // Wait for the API to be fully started before running tests
		console.log('API started successfully');
	} catch (error) {
		console.error('Failed to start API', error);
		process.exit(1); // Exit if the API fails to start
	}
});

// Jest teardown to kill the API process after the tests are done
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
