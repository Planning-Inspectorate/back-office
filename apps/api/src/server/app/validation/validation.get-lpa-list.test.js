// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
// eslint-disable-next-line import/no-unresolved
import got from 'got';
import { app } from '../../app.js';

const request = supertest(app);
const getStub = sinon.stub();

const otherFake = {
	json: function() {
		return {
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
		};
	}
};

test('gets all LPAs from external API', async(t) => {
	sinon.stub(got, 'get').callsFake(getStub);
	getStub.returns(otherFake);
	const resp = await request.get('/validation/lpa-list');
	console.log(resp.body);
	t.is(resp.status, 200);
	t.deepEqual(resp.body, ['first LPA', 'second LPA']);
});
