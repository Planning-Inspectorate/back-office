import { execSync } from 'node:child_process';
import { TEST_CONTAINER_NAME, TEST_DB_PASSWORD, TEST_DB_PORT } from './config.js';

const checkContainerExists = () => {
	try {
		const result = execSync(
			`docker ps -a --filter "name=${TEST_CONTAINER_NAME}" --format "{{.Names}}"`
		)
			.toString()
			.trim();
		return result === TEST_CONTAINER_NAME;
	} catch (error) {
		console.error('Error checking if container exists: ', error);
		return false;
	}
};

const checkContainerIsRunning = () => {
	try {
		const result = execSync(
			`docker ps --filter "name=${TEST_CONTAINER_NAME}" --format "{{.Names}}"`
		)
			.toString()
			.trim();
		return result === TEST_CONTAINER_NAME;
	} catch (error) {
		console.error('Error checking if container exists: ', error);
		return false;
	}
};

const runExistingContainer = () => {
	console.log(`Starting existing container: ${TEST_CONTAINER_NAME}`);
	try {
		execSync(`docker start ${TEST_CONTAINER_NAME}`);
		console.log('Container started successfully');
	} catch (error) {
		console.error('Error starting container: ', error);
		process.exit(1);
	}
};

const runNewContainer = () => {
	console.log(`Creating and starting new container: ${TEST_CONTAINER_NAME}`);
	try {
		execSync(
			`docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=${TEST_DB_PASSWORD}" -p ${TEST_DB_PORT}:${TEST_DB_PORT} --name ${TEST_CONTAINER_NAME} --hostname ${TEST_CONTAINER_NAME} -d mcr.microsoft.com/mssql/server:2019-CU27-ubuntu-20.04`
		);
		console.log('New container created and started successfully');
	} catch (error) {
		console.error('Error creating and starting new container: ', error);
		process.exit(1);
	}
};

export const startDb = () => {
	const containerExists = checkContainerExists();

	if (containerExists) {
		const containerIsRunning = checkContainerIsRunning();
		if (containerIsRunning) {
			console.log(`Container ${TEST_CONTAINER_NAME} is already running.`);
		} else {
			runExistingContainer();
		}
	} else {
		runNewContainer();
	}
};

export const stopDb = () => {
	try {
		console.log(`Stopping container: ${TEST_CONTAINER_NAME}`);
		execSync(`docker stop ${TEST_CONTAINER_NAME}`);
		console.log('Container stopped successfully');
	} catch (error) {
		console.error('Error stopping container:', error);
	}
};
