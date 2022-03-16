import test from 'ava';
import supertest from 'supertest';
import { app } from '../../app.js';

const request = supertest(app);

test('should modify the selected field of the appeal', async (t) => {
	const resp = await request.patch('/validation/' + 1)
		.send({
			AppellantName: 'Leah Thornton'
		});
	t.is(resp.status, 200);
	// once we have a database, we will check if the register with id I equals to the new value
});

test('should send error when the sent ApellantName is a number', async (t) => {
	const resp = await request.patch('/validation/' + 1)
		.send({
			AppellantName: '123456789'
		});
	t.is(resp.status, 400);
	// once we have a database, we will check if the register with id I equals to the new value
});
