import joi from 'joi';

export default joi.object({
    NODE_ENV: joi.string().valid('development', 'production', 'test'),
    PORT: joi.number(),
    SWAGGER_JSON_DIR: joi.string(),
    DATABASE_URL: joi.string(),
    defaultApiVersion: joi.string()
}).options({ presence: 'required' });
