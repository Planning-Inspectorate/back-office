import test from 'ava';
import supertest from 'supertest';
import { app } from '../../app.js';

const request = supertest(app);

test('gets the appeal information', async (t) => {
	const resp = await request.get('/validation');
	const validationLineNew = { AppealId : 1,
		AppealReference: 'APP/Q9999/D/21/1345264',
		AppealStatus:'new',
		Received: '23 Feb 2022',
		AppealSite:'96 The Avenue, Maidstone, Kent, MD21 5XY' };
	const validationLineIncomplete = { AppealId : 2,
		AppealReference: 'APP/Q9999/D/21/5463281',
		AppealStatus:'incomplete',
		Received: '25 Feb 2022',
		AppealSite:'55 Butcher Street, Thurnscoe, S63 0RB' };
	t.is(resp.status, 200);
	t.deepEqual(resp.body, [validationLineNew, validationLineIncomplete]);
});

test('gets the appeallant information', async (t) => {
	const resp = await request.get('/validation/:id');
	const appealReviewInfo = {
		AppealId : 1,
		AppealReference: 'APP/Q9999/D/21/1345264',
		AppellantName: 'Lee Thornton',
		AppealStatus:'new',
		Received: '23 Feb 2022',
		AppealSite:'96 The Avenue, Maidstone, Kent, MD21 5XY',
		LocalPlanningDepartment: 'Maindstone Borough Council',
		PlanningApplicationReference: '48269/APP/2021/1482'
	};
	t.is(resp.status, 200);
	t.deepEqual(resp.body, appealReviewInfo);
});

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

test('should submit validation decision', async (t) => {
	const resp = await request.post('/validation/' + 1)
		.send({
			AppealStatus:'valid'
		});
	t.is(resp.status, 200);
});
