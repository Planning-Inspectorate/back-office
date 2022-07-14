import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const request = supertest(app);

const createStub = sinon.stub().returns({ id: 1 });

const findUniqueSubSectorStub = sinon.stub();

findUniqueSubSectorStub.withArgs({ where: { name: 'some_sub_sector' } }).returns({});
findUniqueSubSectorStub.withArgs({ where: { name: 'some unknown subsector' } }).returns(null);

test.before('set up mocks', () => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return { create: createStub };
	});

	sinon.stub(databaseConnector, 'subSector').get(() => {
		return { findUnique: findUniqueSubSectorStub };
	});
});

test('creates new application with just title and first notified date', async (t) => {
	const response = await request.post('/applications').send({
		title: 'some title',
		keyDates: {
			firstNotifiedDate: 123_456_789
		}
	});

	t.is(response.status, 200);
	t.deepEqual(response.body, { id: 1 });
	sinon.assert.calledWith(createStub, {
		data: {
			title: 'some title',
			firstNotifiedDate: new Date(123_456_789)
		}
	});
});

test('creates new application with just easting and sub-sector name', async (t) => {
	const response = await request.post('/applications').send({
		geographicalInformation: {
			gridReference: {
				easting: 123_456
			}
		},
		subSectorName: 'some_sub_sector'
	});

	t.is(response.status, 200);
	t.deepEqual(response.body, { id: 1 });
	sinon.assert.calledWith(createStub, {
		data: {
			gridReference: {
				create: {
					easting: 123_456
				}
			},
			ApplicationDetails: {
				create: {
					subSector: {
						connect: {
							name: 'some_sub_sector'
						}
					}
				}
			}
		}
	});
});

test(`creates new application with application first and last name,
        address line, map zoom level`, async (t) => {
	const response = await request.post('/applications').send({
		applicant: {
			firstName: 'first',
			lastName: 'last',
			address: {
				addressLine1: 'some addr'
			}
		},
		geographicalInformation: {
			mapZoomLevel: 'some zoom level'
		}
	});

	t.is(response.status, 200);
	t.deepEqual(response.body, { id: 1 });
	sinon.assert.calledWith(createStub, {
		data: {
			serviceCustomer: {
				create: {
					firstName: 'first',
					lastName: 'last',
					address: {
						create: {
							addressLine1: 'some addr'
						}
					}
				}
			},
			ApplicationDetails: {
				create: {
					mapZoomLevel: 'some zoom level'
				}
			}
		}
	});
});

test('returns error if any validated values are invalid', async (t) => {
	const response = await request.post('/applications').send({
		geographicalInformation: {
			gridReference: {
				easting: '123',
				northing: '12345879'
			}
		},
		applicant: {
			email: 'not a real email',
			phoneNumber: '10235',
			address: {
				postcode: '191187'
			}
		},
		keyDates: {
			firstNotifiedDate: 4_294_967_295_000,
			submissionDate: 123
		},
		subSectorName: 'some unknown subsector'
	});

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			'applicant.address.postcode': 'Postcode must be a valid UK postcode',
			'applicant.email': 'Email must be a valid email',
			'applicant.phoneNumber': 'Phone Number must be a valid UK number',
			'geographicalInformation.gridReference.easting': 'Easting must be integer with 6 digits',
			'geographicalInformation.gridReference.northing': 'Northing must be integer with 6 digits',
			'keyDates.firstNotifiedDate': 'First notified date must be in the past',
			'keyDates.submissionDate': 'Submission date must be in the future',
			subSectorName: 'Must be existing sub-sector'
		}
	});
});
