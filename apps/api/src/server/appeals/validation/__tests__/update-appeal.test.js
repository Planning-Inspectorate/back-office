import supertest from 'supertest';
import { app } from '../../../app-test.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

const request = supertest(app);

const appeal1 = {
	id: 1,
	appealStatus: [
		{
			status: 'received_appeal',
			valid: true
		}
	]
};

describe('Update appeal', () => {
	test('should be able to modify the appellant name', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const resp = await request
			.patch('/appeals/validation/1')
			.send({ AppellantName: 'Leah Thornton' });

		// THEN
		expect(resp.status).toEqual(200);
		expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				appellant: {
					update: {
						name: 'Leah Thornton'
					}
				},
				updatedAt: expect.any(Date)
			}
		});
	});

	test('should be able to modify address', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const resp = await request.patch('/appeals/validation/1').send({
			Address: {
				AddressLine1: 'some new addr',
				AddressLine2: 'some more addr',
				Town: 'town',
				County: 'county',
				PostCode: 'POST CODE'
			}
		});

		// THEN
		expect(resp.status).toEqual(200);
		expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				updatedAt: expect.any(Date),
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
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const resp = await request.patch('/appeals/validation/1').send({
			Address: {
				AddressLine1: 'some new addr',
				Town: 'town'
			}
		});

		// THEN
		expect(resp.status).toEqual(200);
		expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				updatedAt: expect.any(Date),
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
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const resp = await request.patch('/appeals/validation/1').send({
			LocalPlanningDepartment: 'New Planning Department'
		});

		// THEN
		expect(resp.status).toEqual(200);
		expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				updatedAt: expect.any(Date),
				localPlanningDepartment: 'New Planning Department'
			}
		});
	});

	test('should be able to modify planning application reference', async () => {
		// GIVEN
		databaseConnector.appeal.findUnique.mockResolvedValue(appeal1);

		// WHEN
		const resp = await request.patch('/appeals/validation/1').send({
			PlanningApplicationReference: 'New Planning Application Reference'
		});

		// THEN
		expect(resp.status).toEqual(200);
		expect(databaseConnector.appeal.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				updatedAt: expect.any(Date),
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
