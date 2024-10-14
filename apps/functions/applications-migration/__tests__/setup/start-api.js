// @ts-nocheck
import { spawn } from 'node:child_process';
import { TEST_API_PORT } from './config.js';

let apiProcess;

export const startApi = () => {
	return new Promise((resolve, reject) => {
		apiProcess = spawn('npm', ['run', 'api'], {
			env: {
				// need to pass in values of .env file of api

				...process.env,
				PORT: TEST_API_PORT
			},
			cwd: '../../../',
			stdio: ['pipe', 'pipe', 'pipe'],
			shell: true
		});

		apiProcess.stdout.on('data', (data) => {
			const output = data.toString();
			console.log(output);

			if (output.includes(`Server is live at http://localhost:${TEST_API_PORT}`)) {
				resolve(apiProcess);
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
