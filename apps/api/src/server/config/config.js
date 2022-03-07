import { loadEnvironment } from 'planning-inspectorate-libs';

loadEnvironment(process.env.NODE_ENV);

const config = {
	NODE_ENV: process.env.NODE_ENV,
	PORT: process.env.PORT
};

export default config;
