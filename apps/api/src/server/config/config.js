import { loadEnvironment } from '@pins/platform';

loadEnvironment(process.env.NODE_ENV);

const config = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	SWAGGER_JSON_DIR: process.env.SWAGGER_JSON_DIR || './src/server/swagger-output.json'
};

export default config;
