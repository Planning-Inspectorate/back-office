import test from 'ava';
import supertest from 'supertest';
import { app } from '../../app.js';

const request = supertest(app);

test('get / should return \'hello world!\'', async (t) => {
	const resp = await request.get('/');
	t.is(resp.status, 200);
	t.is(resp.text, 'Hello World!');
});
