// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
// eslint-disable-next-line import/no-unresolved
import got from 'got';
import { app } from '../../../app.js';

const request = supertest(app);
const getStub = sinon.stub();

const fakeGet = {
	body: {
		features: [
			{
				attributes: {
					LPA21NM: 'first LPA'
				}
			},
			{
				attributes: {
					LPA21NM: 'second LPA'
				}
			}
		]
	}
};

test.serial('gets all LPAs from external API', async(t) => {
	sinon.stub(got, 'get').callsFake(getStub);
	getStub.returns(fakeGet);
	const resp = await request.get('/validation/lpa-list');
	t.is(resp.status, 200);
	t.deepEqual(resp.body, ['first LPA', 'second LPA']);
	got.get.restore();
});

test.serial('returns 500 if unable to get list of LPAs', async(t) => {
	sinon.stub(got, 'get').callsFake(getStub);
	getStub.throws(new Error('Unable to get data'));
	const resp = await request.get('/validation/lpa-list');
	t.is(resp.status, 500);
	t.deepEqual(resp.body, {
		error: 'Unable to get data',
	});
	got.get.restore();
});
