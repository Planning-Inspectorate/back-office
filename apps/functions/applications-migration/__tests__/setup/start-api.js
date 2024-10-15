// @ts-nocheck
import { spawn } from 'node:child_process';
import { TEST_API_PORT, TEST_DATABASE_URL } from './config.js';

let apiProcess;

export const startApi = () => {
	return new Promise((resolve, reject) => {
		apiProcess = spawn('npm', ['run', 'api'], {
			env: {
				...process.env,
				PORT: TEST_API_PORT,
				DATABASE_URL: TEST_DATABASE_URL
			},
			cwd: '../../../',
			stdio: 'pipe',
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

const result = await startApi();
console.log(result);
