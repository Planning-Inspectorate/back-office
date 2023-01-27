import { yesterday } from '@pins/platform';
import format from 'date-fns/format/index.js';
import sinon, { assert } from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import appealRepository from '../../../repositories/appeal.repository.js';
import { appealFactoryForTests } from '../../../utils/appeal-factory-for-tests.js';

/** @typedef {import('@pins/api').Schema.Appeal} Appeal */

const request = supertest(app);

const siteVisitBody = {
	siteVisitDate: '2030-01-01',
	siteVisitTimeSlot: '8am to 10am',
	siteVisitType: 'accompanied'
};

// todo: replace with factory
const originalAppeal = appealFactoryForTests({
	appealId: 1,
	statuses: [{ id: 1, status: 'site_visit_not_yet_booked', valid: true }],
	typeShorthand: 'HAS',
	inclusions: { connectToUser: true },
	dates: { createdAt: new Date(2022, 0, 1), updatedAt: new Date(2022, 0, 1) }
});

const updatedAppeal = {
	...originalAppeal,
	appealStatus: [{ id: 2, status: 'site_visit_booked', valid: true }],
	siteVisit: {
		id: 1,
		appealId: originalAppeal.id,
		visitDate: new Date(2030, 0, 1),
		visitSlot: '8am to 10am',
		visitType: 'accompanied'
	}
};

const invalidAppeal = {
	...originalAppeal,
	user: { id: 101, azureReference: 101 }
};

const getByIdStub = sinon.stub();
const updateStatusAndDataByIdStub = sinon.stub();

getByIdStub.withArgs(1, { user: true }).returns(originalAppeal);
getByIdStub.withArgs(1).returns(originalAppeal);
getByIdStub.withArgs(1, { siteVisit: true }).returns(updatedAppeal);
getByIdStub.withArgs(2, { user: true }).returns(invalidAppeal);
getByIdStub.withArgs(2).returns(invalidAppeal);

sinon.stub(appealRepository, 'getById').callsFake(getByIdStub);
sinon.stub(appealRepository, 'updateStatusAndDataById').callsFake(updateStatusAndDataByIdStub);

describe('Book site visit', () => {
	beforeEach(() => {
		getByIdStub.resetHistory();
	});

	test('succeeds with a 200 when booking a site visit', async () => {
		const response = await request
			.post('/appeals/inspector/1/book')
			.set('userId', '1')
			.send(siteVisitBody);

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			appealAge: 0,
			appealId: 1,
			appealReceivedDate: '01 January 2022',
			bookedSiteVisit: {
				visitDate: '01 January 2030',
				visitSlot: '8am to 10am',
				visitType: 'accompanied'
			},
			localPlanningDepartment: originalAppeal.localPlanningDepartment,
			planningApplicationReference: originalAppeal.planningApplicationReference,
			reference: originalAppeal.reference,
			status: 'booked'
		});

		assert.calledWith(updateStatusAndDataByIdStub, 1, 'site_visit_booked', {
			siteVisit: {
				create: {
					visitDate: new Date(2030, 0, 1),
					visitSlot: '8am to 10am',
					visitType: 'accompanied'
				}
			}
		});
		assert.calledWith(getByIdStub, 1, { siteVisit: true });
	});

	test('fails with a 401 status when no `userId` is present', async () => {
		const response = await request.post('/appeals/inspector/1/book').send(siteVisitBody);

		expect(response.status).toEqual(401);
		expect(response.body).toEqual({
			errors: {
				userid: 'Authentication error. Missing header `userId`.'
			}
		});
	});

	test('fails with a 403 status when the `userId` is different from the appeal user', async () => {
		const response = await request
			.post('/appeals/inspector/1/book')
			.set('userId', '101')
			.send(siteVisitBody);

		expect(response.status).toEqual(403);
		expect(response.body).toEqual({
			errors: {
				userid: 'User is not permitted to perform this action.'
			}
		});
	});

	test('fails with a 400 status when an invalid `siteVisitDate` is present', async () => {
		const response = await request
			.post('/appeals/inspector/1/book')
			.set('userId', '1')
			.send({ ...siteVisitBody, siteVisitDate: '*' });

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				siteVisitDate: 'Enter a site visit date'
			}
		});
	});

	test('fails with a 400 status when  a `siteVisitDate` is in an incorrect format', async () => {
		const response = await request
			.post('/appeals/inspector/1/book')
			.set('userId', '1')
			.send({ ...siteVisitBody, siteVisitDate: '01-01-2030' });

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				siteVisitDate: 'Enter a site visit date'
			}
		});
	});

	test('fails with a 400 status when a `siteVisitDate` is in the past', async () => {
		const response = await request
			.post('/appeals/inspector/1/book')
			.set('userId', '1')
			.send({ ...siteVisitBody, siteVisitDate: format(yesterday(), 'yyyy-MM-dd') });

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				siteVisitDate: 'Site visit date must be in the future'
			}
		});
	});

	test('fails with a 400 status when an invalid `siteVisitTimeSlot` is present', async () => {
		const response = await request
			.post('/appeals/inspector/1/book')
			.set('userId', '1')
			.send({ ...siteVisitBody, siteVisitTimeSlot: '*' });

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				siteVisitTimeSlot: 'Select a valid time slot'
			}
		});
	});

	test('fails with a 400 status when an invalid `siteVisitType` is present', async () => {
		const response = await request
			.post('/appeals/inspector/1/book')
			.set('userId', '1')
			.send({ ...siteVisitBody, siteVisitType: '*' });

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				siteVisitType: 'Select a type of site visit'
			}
		});
	});
});
