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

	clear() {
		this.headers = {};
		this.body = {};
	}

	async get(options = {}) {
		const { headers, token, path, query } = options;
		if (headers) {
			this.setHeaders(headers);
		}

		if (token) {
			this.setBearerToken(token);
		}

		if (path) {
			this.path = path;
		}

		if (query && Object.keys(query).length > 0) {
			this.query = query;
		} else {
			this.query = {};
		}

		try {
			logger.log('blue', `Requesting: ${this.path}`);

			let req = this.request.get(this.path);

			if (Object.keys(this.query).length > 0) {
				req = req.query(this.query);
			}

			const { body, statusCode } = await req.set(this.headers);

			return { statusCode, body };
		} catch (error) {
			throw new Error(`Error in GET request: ${error.message}`);
		}
	}

	async post(options = {}) {
		const { headers, token, payload, path } = options;
		if (headers) {
			this.setHeaders(headers);
		}

		if (token) {
			this.setBearerToken(token);
		}

		if (payload) {
			this.setBody(payload);
		}

		if (path) {
			this.path = path;
		}

		try {
			logger.log('blue', `Requesting: ${this.path}`);
			const response = await this.request.post(this.path).send(this.body).set(this.headers);
			return response;
		} catch (error) {
			throw new Error(`Error in post request: ${error.message}`);
		}
	}

	async put(options = {}) {
		const { headers, token, payload, path } = options;
		if (headers) {
			this.setHeaders(headers);
		}

		if (token) {
			this.setBearerToken(token);
		}

		if (payload) {
			this.setBody(payload);
		}

		if (path) {
			this.path = path;
		}

		try {
			logger.log('blue', `Requesting: ${this.path}`);
			const response = await this.request.put(this.path).send(this.body).set(this.headers);
			return response;
		} catch (error) {
			throw new Error(`Error in PUT request to ${this.path}: ${error.message}`);
		}
	}

	async patch(options = {}) {
		const { headers, token, payload, path } = options;
		if (headers) {
			this.setHeaders(headers);
		}

		if (token) {
			this.setBearerToken(token);
		}

		if (payload) {
			this.setBody(payload);
		}

		if (path) {
			this.path = path;
		}

		try {
			logger.log('blue', `Requesting: ${this.path}`);
			const response = await this.request.patch(this.path).send(this.body).set(this.headers);
			return response;
		} catch (error) {
			throw new Error(`Error in PATCH request to ${this.path}: ${error.message}`);
		}
	}
}
