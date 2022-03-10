import { loadEnvironment } from 'planning-inspectorate-libs';

loadEnvironment(process.env.NODE_ENV);

const config = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT,
	SQL_SERVER_DATABASE: process.env.SQL_SERVER_DATABASE,
	SQL_SERVER_USERNAME: process.env.SQL_SERVER_USERNAME,
	SQL_SERVER_PASSWORD: process.env.SQL_SERVER_PASSWORD,
	SQL_SERVER_HOST: process.env.SQL_SERVER_HOST 
};

export default config;
