import joi from 'joi';

const logLevel = ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'];

export default joi.object({
    NODE_ENV: joi.string().valid('development', 'production', 'test'),
    PORT: joi.number(),
    SWAGGER_JSON_DIR: joi.string(),
    DATABASE_URL: joi.string().uri()
})
