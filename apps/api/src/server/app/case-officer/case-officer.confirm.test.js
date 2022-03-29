// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import supertest from 'supertest';
import { app } from '../../app.js';

const request = supertest(app);

test('should submit confirmation of the outcome of LPA questionnaire', async (t) => {
	const resp = await request.post('/case-officer/id:/confirm')
		.send({
			Complete: true
		});
	t.is(resp.status, 200);
});
