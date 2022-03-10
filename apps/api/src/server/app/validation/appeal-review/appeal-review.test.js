import test from 'ava';
import supertest from 'supertest';
import { app } from '../../../app.js';

const request = supertest(app);

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
	t.deepEqual(resp.body, [appealReviewInfo]);
});
