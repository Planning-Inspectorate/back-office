import { loadEnvironment } from '@pins/platform';
import joi from 'joi';

const schema = joi.object({
	username: joi.string(),
	password: joi.string(),
	database: joi.string(),
	host: joi.string()
});

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	username: environment.DATABASE_USERNAME,
	password: environment.DATABASE_PASSWORD,
	database: environment.DATABASE_NAME,
	host: environment.DATABASE_HOST
});

if (error) {
	throw error;
}

export default value;
