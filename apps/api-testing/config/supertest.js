// @ts-nocheck
import supertest from 'supertest';
import config from './config.cjs';
import { Logger } from '../utils/logger.js';

const logger = new Logger();
logger.log('cyan', `Running tests against: ${config.baseUrl}`);
const request = supertest(config.baseUrl);

export default request;
