import Prisma from '@prisma/client';
import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { eventClient } from '../../../infrastructure/event-client.js';
import { databaseConnector } from '../../../utils/database-connector.js';
import { validateNsipProject } from './schemas-test-utils.js';

const request = supertest(app);

const updateStub = sinon.stub().returns({ id: 1, serviceCustomer: [{ id: 2 }, { id: 3 }] });

const expectedEventPayload = {
	id: 1,
	caseTeams: [],
	customers: [
		{
			id: 2,
			customerType: 'applicant'
		},
		{
			id: 3,
			customerType: 'applicant'
		}
	],
	inspectors: [],
	sourceSystem: 'ODT',
	status: [],
	type: {
		code: 'application'
	},
	validationOfficers: []
};

const findUniqueSubSectorStub = sinon.stub();

findUniqueSubSectorStub.withArgs({ where: { name: 'some_sub_sector' } }).returns({});
findUniqueSubSectorStub.withArgs({ where: { name: 'some unknown subsector' } }).returns(null);

/**
 * @type {sinon.SinonStub<any, any>}
 */
let findUniqueStub;

const findUniqueServiceCustomerStub = sinon.stub();

findUniqueServiceCustomerStub.withArgs({ where: { id: 1 } }).returns({ id: 1, caseId: 1 });
findUniqueServiceCustomerStub.withArgs({ where: { id: 2 } }).returns({ id: 2, caseId: 2 });

const findUniqueZoomLevelStub = sinon.stub();

findUniqueZoomLevelStub.withArgs({ where: { name: 'some-unknown-map-zoom-level' } }).returns(null);
findUniqueZoomLevelStub.withArgs({ where: { name: 'some-known-map-zoom-level' } }).returns({});

const findUniqueRegionStub = sinon.stub();

findUniqueRegionStub.withArgs({ where: { name: 'region1' } }).returns({});
findUniqueRegionStub.withArgs({ where: { name: 'region2' } }).returns({});
findUniqueRegionStub.withArgs({ where: { name: 'some-unknown-region' } }).returns(null);

const deleteManyStub = sinon.stub();

/**
 * @type {sinon.SinonStub<any, any>}
 */
let stubbedSendEvents;

test.before('set up mocks', () => {
	findUniqueStub = sinon.stub();

	findUniqueStub
		.withArgs({ where: { id: 1 } })
		.returns({ id: 1, serviceCustomer: [{ id: 2 }, { id: 3 }] });
	findUniqueStub.withArgs({ where: { id: 2 } }).returns(null);

	sinon.stub(databaseConnector, 'case').get(() => {
		return { update: updateStub, findUnique: findUniqueStub };
	});

	sinon.stub(databaseConnector, 'subSector').get(() => {
		return { findUnique: findUniqueSubSectorStub };
	});

	sinon.stub(databaseConnector, 'serviceCustomer').get(() => {
		return { findUnique: findUniqueServiceCustomerStub };
	});

	sinon.stub(databaseConnector, 'zoomLevel').get(() => {
		return { findUnique: findUniqueZoomLevelStub };
	});

	sinon.stub(databaseConnector, 'region').get(() => {
		return { findUnique: findUniqueRegionStub };
	});

	sinon.stub(databaseConnector, 'regionsOnApplicationDetails').get(() => {
		return { deleteMany: deleteManyStub };
	});

	sinon
		.stub(Prisma.PrismaClient.prototype, '$transaction')
		.returns([{ id: 1, serviceCustomer: [{ id: 2 }, { id: 3 }] }]);

	sinon.useFakeTimers({ now: 1_649_319_144_000 });
	stubbedSendEvents = sinon.stub(eventClient, 'sendEvents');
});

test('update-application updates application with just title and first notified date', async (t) => {
	findUniqueStub.returns({ id: 1, serviceCustomer: [{ id: 2 }, { id: 3 }] });

	const response = await request.patch('/applications/1').send({
		title: 'some title',
		keyDates: {
			submissionDateInternal: 1_649_319_344_000
		}
	});

	t.is(response.status, 200);
	t.deepEqual(response.body, { id: 1, applicantIds: [2, 3] });
	sinon.assert.calledWith(updateStub, {
		where: { id: 1 },
		data: {
			modifiedAt: new Date(1_649_319_144_000),
			title: 'some title',
			ApplicationDetails: {
				upsert: {
					create: {
						submissionAtInternal: new Date(1_649_319_344_000_000)
					},
					update: {
						submissionAtInternal: new Date(1_649_319_344_000_000)
					}
				}
			}
		},
		include: {
			serviceCustomer: true
		}
	});

	t.deepEqual(validateNsipProject(stubbedSendEvents.getCall(0).args[1][0]), true);
	sinon.assert.calledWith(stubbedSendEvents, 'nsip-project', [expectedEventPayload]);
});

test('update-application updates application with just easting and sub-sector name', async (t) => {
	stubbedSendEvents.resetHistory();
	findUniqueStub.returns({ id: 1, serviceCustomer: [{ id: 2 }, { id: 3 }] });

	const response = await request.patch('/applications/1').send({
		geographicalInformation: {
			gridReference: {
				easting: 123_456
			}
		},
		subSectorName: 'some_sub_sector'
	});

	t.is(response.status, 200);
	t.deepEqual(response.body, { id: 1, applicantIds: [2, 3] });
	sinon.assert.calledWith(updateStub, {
		where: { id: 1 },
		data: {
			modifiedAt: new Date(1_649_319_144_000),
			gridReference: { upsert: { create: { easting: 123_456 }, update: { easting: 123_456 } } },
			ApplicationDetails: {
				upsert: {
					create: { subSector: { connect: { name: 'some_sub_sector' } } },
					update: { subSector: { connect: { name: 'some_sub_sector' } } }
				}
			}
		},
		include: {
			serviceCustomer: true
		}
	});

	t.deepEqual(validateNsipProject(stubbedSendEvents.getCall(1).args[1][0]), true);
	sinon.assert.calledWith(stubbedSendEvents, 'nsip-project', [expectedEventPayload]);
});

test('update-application updates application when all possible details provided', async (t) => {
	findUniqueStub.returns({ id: 1, serviceCustomer: [{ id: 2 }, { id: 3 }] });

	const response = await request.patch('/applications/1').send({
		title: 'title',
		description: 'description',
		subSectorName: 'some_sub_sector',
		caseEmail: 'caseEmail@pins.com',
		applicants: [
			{
				id: 1,
				firstName: 'first',
				middleName: 'middle',
				lastName: 'last',
				organisationName: 'org',
				email: 'test@test.com',
				website: 'www.google.com',
				phoneNumber: '02036579785',
				address: {
					addressLine1: 'address line 1',
					addressLine2: 'address line 2',
					town: 'town',
					county: 'county',
					postcode: 'N1 9BE'
				}
			}
		],
		geographicalInformation: {
			mapZoomLevelName: 'some-known-map-zoom-level',
			locationDescription: 'location description',
			regionNames: ['region1', 'region2'],
			gridReference: {
				easting: '123456',
				northing: '987654'
			}
		},
		keyDates: {
			submissionDateInternal: 1_649_319_344_000,
			submissionDatePublished: 'Q1 2023'
		}
	});

	t.is(response.status, 200);
	t.deepEqual(response.body, { id: 1, applicantIds: [2, 3] });
	sinon.assert.calledWith(deleteManyStub, {
		where: { applicationDetailsId: 1 }
	});

	sinon.assert.calledWith(updateStub, {
		where: { id: 1 },
		data: {
			modifiedAt: new Date(1_649_319_144_000),
			title: 'title',
			description: 'description',
			gridReference: {
				upsert: {
					create: { easting: 123_456, northing: 987_654 },
					update: { easting: 123_456, northing: 987_654 }
				}
			},
			ApplicationDetails: {
				upsert: {
					create: {
						caseEmail: 'caseEmail@pins.com',
						locationDescription: 'location description',
						submissionAtInternal: new Date(1_649_319_344_000_000),
						submissionAtPublished: 'Q1 2023',
						subSector: { connect: { name: 'some_sub_sector' } },
						zoomLevel: { connect: { name: 'some-known-map-zoom-level' } },
						regions: {
							create: [
								{ region: { connect: { name: 'region1' } } },
								{ region: { connect: { name: 'region2' } } }
							]
						}
					},
					update: {
						caseEmail: 'caseEmail@pins.com',
						locationDescription: 'location description',
						submissionAtInternal: new Date(1_649_319_344_000_000),
						submissionAtPublished: 'Q1 2023',
						subSector: { connect: { name: 'some_sub_sector' } },
						zoomLevel: { connect: { name: 'some-known-map-zoom-level' } },
						regions: {
							create: [
								{ region: { connect: { name: 'region1' } } },
								{ region: { connect: { name: 'region2' } } }
							]
						}
					}
				}
			},
			serviceCustomer: {
				update: {
					data: {
						organisationName: 'org',
						firstName: 'first',
						middleName: 'middle',
						lastName: 'last',
						email: 'test@test.com',
						website: 'www.google.com',
						phoneNumber: '02036579785',
						address: {
							upsert: {
								create: {
									addressLine1: 'address line 1',
									addressLine2: 'address line 2',
									town: 'town',
									county: 'county',
									postcode: 'N1 9BE'
								},
								update: {
									addressLine1: 'address line 1',
									addressLine2: 'address line 2',
									town: 'town',
									county: 'county',
									postcode: 'N1 9BE'
								}
							}
						}
					},
					where: { id: 1 }
				}
			}
		},
		include: {
			serviceCustomer: true
		}
	});

	t.deepEqual(validateNsipProject(stubbedSendEvents.getCall(2).args[1][0]), true);
	sinon.assert.calledWith(stubbedSendEvents, 'nsip-project', [expectedEventPayload]);
});

test(`update-application with new applicant using first and last name,
        address line, map zoom level`, async (t) => {
	findUniqueStub.returns({ id: 1, serviceCustomer: [{ id: 2 }, { id: 3 }] });

	const response = await request.patch('/applications/1').send({
		applicants: [
			{
				firstName: 'first',
				lastName: 'last',
				address: {
					addressLine1: 'some addr'
				}
			}
		],
		geographicalInformation: {
			mapZoomLevelName: 'some-known-map-zoom-level'
		}
	});

	t.is(response.status, 200);
	t.deepEqual(response.body, { id: 1, applicantIds: [2, 3] });
	sinon.assert.calledWith(updateStub, {
		where: { id: 1 },
		data: {
			modifiedAt: new Date(1_649_319_144_000),
			serviceCustomer: {
				create: {
					firstName: 'first',
					lastName: 'last',
					address: { create: { addressLine1: 'some addr' } }
				}
			},
			ApplicationDetails: {
				upsert: {
					create: {
						zoomLevel: { connect: { name: 'some-known-map-zoom-level' } }
					},
					update: {
						zoomLevel: { connect: { name: 'some-known-map-zoom-level' } }
					}
				}
			}
		},
		include: {
			serviceCustomer: true
		}
	});

	t.deepEqual(validateNsipProject(stubbedSendEvents.getCall(3).args[1][0]), true);
	sinon.assert.calledWith(stubbedSendEvents, 'nsip-project', [expectedEventPayload]);
});

test('update-application returns error if any validated values are invalid', async (t) => {
	const response = await request.patch('/applications/1').send({
		caseEmail: 'not a real email',
		geographicalInformation: {
			gridReference: {
				easting: '123',
				northing: '12345879'
			},
			mapZoomLevelName: 'some-unknown-map-zoom-level',
			regionNames: ['some-unknown-region']
		},
		applicants: [
			{
				email: 'not a real email',
				phoneNumber: '10235',
				address: {
					postcode: '191187'
				}
			}
		],
		keyDates: {
			submissionDateInternal: 100_000
		},
		subSectorName: 'some unknown subsector'
	});

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			caseEmail: 'Case email must be a valid email address',
			'applicants[0].address.postcode': 'Postcode must be a valid UK postcode',
			'applicants[0].email': 'Email must be a valid email',
			'applicants[0].phoneNumber': 'Phone Number must be a valid UK number',
			'geographicalInformation.gridReference.easting': 'Easting must be integer with 6 digits',
			'geographicalInformation.gridReference.northing': 'Northing must be integer with 6 digits',
			'geographicalInformation.mapZoomLevelName': 'Must be a valid map zoom level',
			'geographicalInformation.regionNames': 'Unknown region',
			'keyDates.submissionDateInternal': 'Submission date internal must be in the future',
			subSectorName: 'Must be existing sub-sector'
		}
	});
});

test('update-application throws error if unknown application id provided', async (t) => {
	const response = await request.patch('/applications/2');

	t.is(response.status, 404);
	t.deepEqual(response.body, {
		errors: {
			id: 'Must be an existing application'
		}
	});
});

test('update-application throws error if unknown applicant id provided', async (t) => {
	const response = await request.patch('/applications/1').send({ applicants: [{ id: 3 }] });

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			'applicants[0].id': 'Must be existing applicant that belongs to this case'
		}
	});
});

test('update-application throws error if applicant id that doesnt belong to case provided', async (t) => {
	const response = await request.patch('/applications/1').send({ applicants: [{ id: 2 }] });

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			'applicants[0].id': 'Must be existing applicant that belongs to this case'
		}
	});
});
