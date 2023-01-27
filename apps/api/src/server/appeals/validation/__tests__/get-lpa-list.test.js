import got from 'got';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';

const request = supertest(app);

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

describe('Get LPA list', () => {
	describe('runs first', () => {
		test('gets all LPAs from external API', async () => {
			const getStub = sinon.stub();

			sinon.stub(got, 'get').callsFake(getStub);
			getStub.returns(fakeGet);

			const resp = await request.get('/appeals/validation/lpa-list');

			expect(resp.status).toEqual(200);
			expect(resp.body).toEqual(['first LPA', 'second LPA']);

			got.get.restore();
		});
	});

	describe('runs second', () => {
		test('returns 500 if unable to get list of LPAs', async () => {
			const getStub = sinon.stub();

			sinon.stub(got, 'get').callsFake(getStub);
			getStub.throws(new Error('Unable to get data'));

			const resp = await request.get('/appeals/validation/lpa-list');

			expect(resp.status).toEqual(500);
			expect(resp.body).toEqual({ errors: 'Unable to get data' });
		});
	});
});
