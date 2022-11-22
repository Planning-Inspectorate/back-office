import joi from 'joi';

export default joi
	.object({
		NODE_ENV: joi.string().valid('development', 'production', 'test'),
		PORT: joi.number(),
		SWAGGER_JSON_DIR: joi.string(),
		blobStore: joi.object({
			host: joi.string(),
			connectionString: joi.string(),
			container: joi.string()
		}),
		log: joi.object({
			levelFile: joi.string(),
			levelStdOut: joi.string()
		}),
		cwd: joi.string(),
		defaultApiVersion: joi.string(),
		featureFlags: joi.object({
			featureFlagBoasXTestFeature: joi.boolean()
		})
	})
	.options({ presence: 'required' });
