import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
// @ts-ignore
import { app } from '../../../app.js';
import { eventClient } from '../../../infrastructure/event-client.js';
import { databaseConnector } from '../../../utils/database-connector.js';
import { validateNsipProject } from './schema-test-utils.js';
const request = supertest(app);

const createStub = sinon.stub().returns({ id: 1, serviceCustomer: [{ id: 4 }] });

const expectedEventPayload = {
	id: 1,
	caseTeams: [],
	customers: [
		{
			id: 4,
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

const findUniqueZoomLevelStub = sinon.stub();

findUniqueZoomLevelStub.withArgs({ where: { name: 'some-unknown-map-zoom-level' } }).returns(null);
findUniqueZoomLevelStub.withArgs({ where: { name: 'some-known-map-zoom-level' } }).returns({});

const findUniqueRegionStub = sinon.stub();

findUniqueRegionStub.withArgs({ where: { name: 'region1' } }).returns({});
findUniqueRegionStub.withArgs({ where: { name: 'region2' } }).returns({});
findUniqueRegionStub.withArgs({ where: { name: 'some-unknown-region' } }).returns(null);

/**
 * @type {sinon.SinonSpy<any, any>}
 */
let stubbedSendEvents;

test.before('set up mocks', () => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return { create: createStub };
	});

	sinon.stub(databaseConnector, 'subSector').get(() => {
		return { findUnique: findUniqueSubSectorStub };
	});

	sinon.stub(databaseConnector, 'zoomLevel').get(() => {
		return { findUnique: findUniqueZoomLevelStub };
	});

	sinon.stub(databaseConnector, 'region').get(() => {
		return { findUnique: findUniqueRegionStub };
	});

	sinon.useFakeTimers({ now: 1_649_319_144_000 });

	stubbedSendEvents = sinon.stub(eventClient, 'sendEvents');
});

test('creates new application with just title and first notified date', async (t) => {
	const response = await request.post('/applications').send({
		title: 'some title',
		keyDates: {
			submissionDateInternal: 1_649_319_344_000
		}
	});

	t.is(response.status, 200);
	t.deepEqual(response.body, { id: 1, applicantIds: [4] });
	sinon.assert.calledWith(
		createStub,
		sinon.match({
			data: {
				title: 'some title',
				ApplicationDetails: {
					create: {
						submissionAtInternal: new Date(1_649_319_344_000_000)
					}
				},
				CaseStatus: {
					create: {
						status: 'draft'
					}
				}
			}
		})
	);

	// This whole thing around getting the call number is horrendous, hopefully we can fix this soon with jest
	t.deepEqual(validateNsipProject(stubbedSendEvents.getCall(0).args[1][0]), true);
	sinon.assert.calledWith(stubbedSendEvents, 'nsip-project', [expectedEventPayload]);
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
	t.deepEqual(response.body, { id: 1, applicantIds: [4] });
	sinon.assert.calledWith(
		createStub,
		sinon.match({
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
				},
				CaseStatus: {
					create: {
						status: 'draft'
					}
				}
			}
		})
	);

	t.deepEqual(validateNsipProject(stubbedSendEvents.getCall(1).args[1][0]), true);
	sinon.assert.calledWith(stubbedSendEvents, 'nsip-project', [expectedEventPayload]);
});

test('creates new application when all possible details provided', async (t) => {
	const response = await request.post('/applications').send({
		title: 'title',
		description: 'description',
		subSectorName: 'some_sub_sector',
		caseEmail: 'caseEmail@pins.com',
		applicants: [
			{
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
	t.deepEqual(response.body, { id: 1, applicantIds: [4] });
	sinon.assert.calledWith(
		createStub,
		sinon.match({
			data: {
				title: 'title',
				description: 'description',
				gridReference: { create: { easting: 123_456, northing: 987_654 } },
				ApplicationDetails: {
					create: {
						caseEmail: 'caseEmail@pins.com',
						zoomLevel: { connect: { name: 'some-known-map-zoom-level' } },
						locationDescription: 'location description',
						submissionAtInternal: new Date(1_649_319_344_000_000),
						submissionAtPublished: 'Q1 2023',
						subSector: { connect: { name: 'some_sub_sector' } },
						regions: {
							create: [
								{ region: { connect: { name: 'region1' } } },
								{ region: { connect: { name: 'region2' } } }
							]
						}
					}
				},
				serviceCustomer: {
					create: {
						organisationName: 'org',
						firstName: 'first',
						middleName: 'middle',
						lastName: 'last',
						email: 'test@test.com',
						website: 'www.google.com',
						phoneNumber: '02036579785',
						address: {
							create: {
								addressLine1: 'address line 1',
								addressLine2: 'address line 2',
								town: 'town',
								county: 'county',
								postcode: 'N1 9BE'
							}
						}
					}
				},
				CaseStatus: { create: { status: 'draft' } }
			}
		})
	);

	t.deepEqual(validateNsipProject(stubbedSendEvents.getCall(2).args[1][0]), true);
	sinon.assert.calledWith(stubbedSendEvents, 'nsip-project', [expectedEventPayload]);
});

test(`creates new application with application first and last name,
        address line, map zoom level`, async (t) => {
	const response = await request.post('/applications').send({
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
	t.deepEqual(response.body, { id: 1, applicantIds: [4] });
	sinon.assert.calledWith(
		createStub,
		sinon.match({
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
						zoomLevel: { connect: { name: 'some-known-map-zoom-level' } }
					}
				},
				CaseStatus: {
					create: {
						status: 'draft'
					}
				}
			}
		})
	);
	t.deepEqual(validateNsipProject(stubbedSendEvents.getCall(3).args[1][0]), true);
	sinon.assert.calledWith(stubbedSendEvents, 'nsip-project', [expectedEventPayload]);
});

test('returns error if any validated values are invalid', async (t) => {
	const response = await request.post('/applications').send({
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
			submissionDateInternal: 1_000_000
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
