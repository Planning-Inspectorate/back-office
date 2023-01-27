import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const request = supertest(app);

const includingDetailsForValidtion = {
	appealStatus: { where: { valid: true } },
	appealType: true
};

const findUniqueStub = sinon.stub();

const appeal1 = {
	id: 1,
	appealStatus: [
		{
			status: 'received_appeal',
			valid: true
		}
	]
};

findUniqueStub
	.withArgs({ where: { id: 1 }, include: includingDetailsForValidtion })
	.returns(appeal1);

const updateStub = sinon.stub();

describe('Update appeal', () => {
	beforeAll(() => {
		sinon.stub(databaseConnector, 'appeal').get(() => {
			return { findUnique: findUniqueStub, update: updateStub };
		});
		sinon.stub(databaseConnector, 'appealStatus').get(() => {
			return { create: sinon.stub() };
		});
	});

	test('should be able to modify the appellant name', async () => {
		const resp = await request
			.patch('/appeals/validation/1')
			.send({ AppellantName: 'Leah Thornton' });

		expect(resp.status).toEqual(200);
		sinon.assert.calledWithExactly(updateStub, {
			where: { id: 1 },
			data: {
				appellant: {
					update: {
						name: 'Leah Thornton'
					}
				},
				updatedAt: sinon.match.any
			}
		});
	});

	test('should be able to modify address', async () => {
		const resp = await request.patch('/appeals/validation/1').send({
			Address: {
				AddressLine1: 'some new addr',
				AddressLine2: 'some more addr',
				Town: 'town',
				County: 'county',
				PostCode: 'POST CODE'
			}
		});

		expect(resp.status).toEqual(200);
		sinon.assert.calledWithExactly(updateStub, {
			where: { id: 1 },
			data: {
				updatedAt: sinon.match.any,
				address: {
					update: {
						addressLine1: 'some new addr',
						addressLine2: 'some more addr',
						town: 'town',
						county: 'county',
						postcode: 'POST CODE'
					}
				}
			}
		});
	});

	test('should be able to modify address even when some parts are null', async () => {
		const resp = await request.patch('/appeals/validation/1').send({
			Address: {
				AddressLine1: 'some new addr',
				Town: 'town'
			}
		});

		expect(resp.status).toEqual(200);
		sinon.assert.calledWithExactly(updateStub, {
			where: { id: 1 },
			data: {
				updatedAt: sinon.match.any,
				address: {
					update: {
						addressLine1: 'some new addr',
						addressLine2: null,
						county: null,
						town: 'town',
						postcode: null
					}
				}
			}
		});
	});

	test('should be able to modify local planning department', async () => {
		const resp = await request.patch('/appeals/validation/1').send({
			LocalPlanningDepartment: 'New Planning Department'
		});

		expect(resp.status).toEqual(200);
		sinon.assert.calledWithExactly(updateStub, {
			where: { id: 1 },
			data: {
				updatedAt: sinon.match.any,
				localPlanningDepartment: 'New Planning Department'
			}
		});
	});

	test('should be able to modify planning application reference', async () => {
		const resp = await request.patch('/appeals/validation/1').send({
			PlanningApplicationReference: 'New Planning Application Reference'
		});

		expect(resp.status).toEqual(200);
		sinon.assert.calledWithExactly(updateStub, {
			where: { id: 1 },
			data: {
				updatedAt: sinon.match.any,
				planningApplicationReference: 'New Planning Application Reference'
			}
		});
	});

	// TODO: add validation using express validator
	// test('should throw an error if unexpected keys provided in the body', async(t) => {
	// 	const resp = await request.patch('/appeals/validation/1')
	// 		.send({
	// 			PlanningApplicationReference: 'New Planning Application Reference',
	// 			Test: 'something unexpected'
	// 		});
	// 	expect(resp.status, 400);
	// 	expect(resp.body, { error: 'Invalid request keys' });
	// });

	// test('should throw an error if no Address keys provided in the body', async(t) => {
	// 	const resp = await request.patch('/appeals/validation/1')
	// 		.send({
	// 			PlanningApplicationReference: 'New Planning Application Reference',
	// 			Address: {}
	// 		});
	// 	expect(resp.status, 400);
	// 	expect(resp.body, { error: 'Invalid Address in body' });
	// });

	// test('should throw an error if invalid Address keys provided in the body', async(t) => {
	// 	const resp = await request.patch('/appeals/validation/1')
	// 		.send({
	// 			PlanningApplicationReference: 'New Planning Application Reference',
	// 			Address: {
	// 				SomeUnexpectedKey: 1
	// 			}
	// 		});
	// 	expect(resp.status, 400);
	// 	expect(resp.body, { error: 'Invalid Address in body' });
	// });
});
