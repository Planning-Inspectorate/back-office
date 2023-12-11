import { loadEnvironment } from '@pins/platform';
import joi from 'joi';

const schema = joi.object({
	NODE_ENV: joi.string().valid('development', 'production', 'test'),
	apiHost: joi.string()
});

const environment = loadEnvironment(process.env.NODE_ENV);

const { value, error } = schema.validate({
	NODE_ENV: environment.NODE_ENV,
	apiHost: environment.API_HOST
});

if (error) {
	throw error;
}

export default value;
