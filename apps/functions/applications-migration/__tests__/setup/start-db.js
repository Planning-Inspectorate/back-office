import { execSync } from 'node:child_process';
import { TEST_CONTAINER_NAME } from './config.js';

const checkContainerExists = () => {
	try {
		const result = execSync(
			`docker ps -a --filter "name=${TEST_CONTAINER_NAME} --format "{{.Names}}"`
		)
			.toString()
			.trim();
		return result === TEST_CONTAINER_NAME;
	} catch (error) {
		console.error('Error checking if container exists: ', error);
		return false;
	}
};

export const startDb = () => {};
