'use strict';

const { app } = require('../../app');
const supertest = require('supertest');
const request = supertest(app);

describe("get home endpoint", () => {
	it("get / should return 'hello world!'", async () => {
		const resp = await request.get("/");
		expect(resp.status).toEqual(200);
		expect(resp.text).toEqual("Hello World!");
	});
});
