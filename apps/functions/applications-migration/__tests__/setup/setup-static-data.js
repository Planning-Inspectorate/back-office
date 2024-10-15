import { spawn } from 'node:child_process';

export const setupStaticData = async () => {
	try {
		await runDbMigration();
		await runDbSeed();
	} catch (error) {
		console.error('Error setting up static data: ', error);
	}
};

const runDbMigration = () => {
	return new Promise((resolve, reject) => {
		const migrationProcess = spawn('npm', ['run', 'db:migrate'], {
			env: {
				...process.env
			},
			stdio: 'pipe',
			shell: true
		});

		migrationProcess.on('error', (error) => {
			console.error(`Error migrating DB: ${error}`);
			reject(error);
		});

		migrationProcess.on('exit', (code) => {
			if (code === 0) {
				resolve(null);
			} else {
				reject(`Migration process exited with code: ${code}`);
			}
		});
	});
};

const runDbSeed = () => {
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
				reject(`Seeding process exited with code: ${code}`);
			}
		});
	});
};
setupStaticData();
