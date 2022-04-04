// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import supertest from 'supertest';
import { app } from '../../app.js';

const request = supertest(app);

test('should submit confirmation of the outcome of LPA questionnaire', async (t) => {
	const resp = await request.post('/case-officer/6/confirm')
		.send({});
	t.is(resp.status, 200);
});

test('should submit confirmation of an incomplete outcome of LPA questionnaire', async (t) => {
	const resp = await request.post('/case-officer/7/confirm')
		.send({
			reason:{
				applicationPlansToReachDecisionMissingOrIncorrect: true,
				applicationPlansToReachDecisionMissingOrIncorrectDescription: 'Some description'
			}
		});
	t.is(resp.status, 200);
});

