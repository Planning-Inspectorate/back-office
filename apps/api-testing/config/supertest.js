// @ts-nocheck
import supertest from 'supertest';
import config from './config.cjs';
import { Logger } from '../utils/logger.js';

const logger = new Logger();
logger.log('green', '************* Tests starting ****************');
logger.log('cyan', `Running tests against: ${config.baseUrl}`);
logger.log('green', '*********************************************');

const request = supertest(config.baseUrl);

export default request;
