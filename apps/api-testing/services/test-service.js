// @ts-nocheck
import request from '../config/supertest.js';
import { Logger } from '../utils/logger.js';

const logger = new Logger();

export class TestService {
	constructor(path = '/') {
		this.request = request;
		this.path = path;
		this.headers = {};
		this.body = {};
	}

	setHeaders(headers) {
		this.headers = headers;
		return this;
	}

	setBody(body) {
		this.body = body;
		return this;
	}

	setBearerToken(token) {
		this.headers['Authorization'] = `Bearer ${token}`;
		return this;
	}

	reset() {
		this.headers = {};
		this.body = {};
	}

	async get(options = {}) {
		if (options.headers) {
			this.setHeaders(options.headers);
		}

		if (options.token) {
			this.setBearerToken(options.token);
		}

		if (options.path) {
			this.path = options.path;
		}

		try {
			logger.log('blue', `Requesting: ${this.path}`);

			const { body, statusCode } = await this.request.get(this.path).set(this.headers);

			return { statusCode, body };
		} catch (error) {
			throw new Error(`Error in get request: ${error.message}`);
		}
	}

	async post(options = {}) {
		if (options.headers) {
			this.setHeaders(options.headers);
		}

		if (options.token) {
			this.setBearerToken(options.token);
		}

		if (options.payload) {
			this.setBody(options.payload);
		}

		if (options.path) {
			this.path = options.path;
		}

		try {
			logger.log('blue', `Requesting: ${this.path}`);

			const response = await this.request.post(this.path).send(this.body).set(this.headers);

			return response;
		} catch (error) {
			throw new Error(`Error in post request: ${error.message}`);
		}
	}
}
