import test from 'ava';
import supertest from 'supertest';
import { app } from '../../app.js';

const request = supertest(app);

test('should submit validation decision', async (t) => {
	const resp = await request.post('/validation/' + 1)
		.send({
			AppealStatus: 'valid'
		});
	t.is(resp.status, 200);
});
