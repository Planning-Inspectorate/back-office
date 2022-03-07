'use strict';

const { app } = require('../../app');
const { test } = require('ava');
const supertest = require('supertest');
const request = supertest(app);


test('get / should return \'hello world!\'', async (t) => {
	const resp = await request.get('/');
	t.is(resp.status, 200);
	t.is(resp.text, 'Hello World!');
});
