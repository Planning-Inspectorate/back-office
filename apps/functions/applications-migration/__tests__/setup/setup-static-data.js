import { spawn } from 'node:child_process';

export const setupStaticData = () => {
	return new Promise((resolve, reject) => {
		const seedingProcess = spawn('npm', ['run', 'db:seed:prod'], {
			env: {
				...process.env
			},
			stdio: 'pipe',
			shell: true
		});

		seedingProcess.on('error', (error) => {
			console.error(`Error seeding DB: ${error}`);
			reject(error);
		});

		seedingProcess.on('exit', (code) => {
			if (code === 0) {
				resolve(null);
			} else {
				reject(`Process exited with code: ${code}`);
			}
		});
	});
};
