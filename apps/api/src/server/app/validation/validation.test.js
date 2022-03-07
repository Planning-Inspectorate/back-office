'use strict';
const { app } = require('../../app');
const { test } = require('ava');
const supertest = require('supertest');
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
