import { jest } from '@jest/globals';
import { request } from '#app-test';
import { NSIP_PROJECT, SERVICE_USER } from '#infrastructure/topics.js';
import { buildPayloadEventsForSchema } from '#utils/schema-test-utils.js';
import { mockApplicationGet } from '#utils/application-factory-for-tests.js';
const { eventClient } = await import('#infrastructure/event-client.js');
const { databaseConnector } = await import('#utils/database-connector.js');

const createdCase = {
	id: 1,
	applicantId: 4,
	description: 'Project description',
	reference: 'TEST',
	title: 'BC010003 - NI Case 3 Name'
};

const expectedNsipProjectPayload = buildPayloadEventsForSchema(NSIP_PROJECT, {
	anticipatedDateOfSubmission: '2022-07-22T10:38:33.000Z',
	anticipatedSubmissionDateNonSpecific: 'Q1 2023',
	applicantId: '4',
	caseId: 1,
	caseManagerId: null,
	caseReference: 'TEST',
	decision: null,
	easting: 123456,
	environmentalServicesOfficerId: null,
	inspectorIds: [],
	leadInspectorId: null,
	legalOfficerId: null,
	mapZoomLevel: 'country',
	migrationStatus: null,
	northing: 654321,
	notificationDateForEventsDeveloper: null,
	nsipAdministrationOfficerIds: [],
	nsipOfficerIds: [],
	operationsLeadId: null,
	operationsManagerId: null,
	projectDescription: 'Project description',
	projectEmailAddress: 'test@test.com',
	projectLocation: 'Some Location',
	projectName: 'BC010003 - NI Case 3 Name',
	projectType: 'BC01 - Office Use',
	sourceSystem: 'back-office-applications',
	publishStatus: 'unpublished',
	regions: ['north_west', 'south_west'],
	secretaryOfState: null,
	sector: 'BC - Business and Commercial',
	stage: 'draft',
	transboundary: null,
	welshLanguage: false
})[0];

const expectedApplicantPayload = buildPayloadEventsForSchema(SERVICE_USER, {
	addressCountry: null,
	addressCounty: null,
	addressLine1: null,
	addressLine2: null,
	addressTown: null,
	caseReference: 'TEST',
	emailAddress: null,
	faxNumber: null,
	firstName: null,
	id: '4',
	lastName: null,
	organisation: null,
	organisationType: null,
	otherPhoneNumber: null,
	postcode: null,
	role: null,
	salutation: null,
	serviceUserType: 'Applicant',
	sourceSuid: '4',
	sourceSystem: 'back-office-applications',
	telephoneNumber: null,
	webAddress: null
})[0];

jest.useFakeTimers({ doNotFake: ['performance'], now: 1_649_319_144_000 });

beforeEach(async () => {
	jest.clearAllMocks();
});

test('creates new application with just title and first notified date', async () => {
	// GIVEN
	databaseConnector.case.create.mockImplementation(
		mockApplicationGet(createdCase, { applicant: { id: 4 } })
	);
	databaseConnector.case.findUnique.mockImplementation(
		mockApplicationGet(createdCase, { applicant: { id: 4 } })
	);

	// WHEN
	const response = await request.post('/applications').send({
		title: 'some title',
		keyDates: {
			preApplication: {
				submissionAtInternal: 1_649_319_344_000
			}
		},
		geographicalInformation: {
			regionNames: ['east_midlands']
		}
	});

	// THEN
	expect(response.status).toEqual(200);
	expect(response.body).toEqual({ id: 1, applicantId: 4 });
	expect(databaseConnector.case.create).toHaveBeenCalledWith({
		data: {
			title: 'some title',
			ApplicationDetails: {
				create: {
					regions: {
						create: [{ region: { connect: { name: 'east_midlands' } } }]
					},
					submissionAtInternal: new Date(1_649_319_344_000_000)
				}
			},
			CaseStatus: {
				create: {
					status: 'draft'
				}
			}
		},
		include: expect.any(Object)
	});

	expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
		1,
		NSIP_PROJECT,
		[expectedNsipProjectPayload],
		'Create'
	);

	expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
		2,
		SERVICE_USER,
		[expectedApplicantPayload],
		'Create',
		{ entityType: 'Applicant' }
	);
});

test('creates new application with just easting and sub-sector name', async () => {
	// GIVEN
	databaseConnector.case.create.mockImplementation(
		mockApplicationGet(createdCase, { applicant: { id: 4 } })
	);

	// WHEN
	const response = await request.post('/applications').send({
		geographicalInformation: {
			gridReference: {
				easting: 123_456
			}
		},
		subSectorName: 'some_sub_sector'
	});

	// THEN
	expect(response.status).toEqual(200);
	expect(response.body).toEqual({ id: 1, applicantId: 4 });
	expect(databaseConnector.case.create).toHaveBeenCalledWith({
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
		},
		include: expect.any(Object)
	});

	expect(eventClient.sendEvents).toHaveBeenCalledWith(
		NSIP_PROJECT,
		[expectedNsipProjectPayload],
		'Create'
	);
});

test('creates new application when all possible details provided', async () => {
	// GIVEN

	// WHEN
	const response = await request.post('/applications').send({
		title: 'title',
		description: 'description',
		subSectorName: 'some_sub_sector',
		caseEmail: 'caseEmail@pins.com',
		applicant: {
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
		},
		geographicalInformation: {
			mapZoomLevelName: 'some-known-map-zoom-level',
			locationDescription: 'location description',
			regionNames: ['east_midlands', 'london'],
			gridReference: {
				easting: '123456',
				northing: '987654'
			}
		},
		keyDates: {
			preApplication: {
				submissionAtInternal: 1_649_319_344_000,
				submissionAtPublished: 'Q1 2023'
			}
		}
	});

	// THEN
	expect(response.status).toEqual(200);
	expect(response.body).toEqual({ id: 1, applicantId: 4 });
	expect(databaseConnector.case.create).toHaveBeenCalledWith({
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
							{ region: { connect: { name: 'east_midlands' } } },
							{ region: { connect: { name: 'london' } } }
						]
					}
				}
			},
			applicant: {
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
		},
		include: expect.any(Object)
	});

	expect(eventClient.sendEvents).toHaveBeenCalledWith(
		NSIP_PROJECT,
		[expectedNsipProjectPayload],
		'Create'
	);
});

test(`creates new application with application first and last name,
        address line, map zoom level`, async () => {
	// GIVEN

	// WHEN
	const response = await request.post('/applications').send({
		applicant: {
			firstName: 'first',
			lastName: 'last',
			address: {
				addressLine1: 'some addr'
			}
		},
		geographicalInformation: {
			mapZoomLevelName: 'some-known-map-zoom-level'
		}
	});

	// THEN
	expect(response.status).toEqual(200);
	expect(response.body).toEqual({ id: 1, applicantId: 4 });
	expect(databaseConnector.case.create).toHaveBeenCalledWith({
		data: {
			applicant: {
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
		},
		include: expect.any(Object)
	});
	expect(eventClient.sendEvents).toHaveBeenCalledWith(
		NSIP_PROJECT,
		[expectedNsipProjectPayload],
		'Create'
	);
});

test('returns error if any validated values are invalid', async () => {
	// GIVEN
	databaseConnector.zoomLevel.findUnique.mockResolvedValue(null);
	databaseConnector.region.findUnique.mockResolvedValue(null);
	databaseConnector.subSector.findUnique.mockResolvedValue(null);

	// WHEN
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
		applicant: {
			email: 'not a real email',
			phoneNumber: '10235',
			address: {
				postcode: '191187'
			}
		},
		keyDates: {
			preApplication: {
				submissionAtInternal: 1_000_000
			}
		},
		subSectorName: 'some unknown subsector'
	});

	// THEN
	expect(response.status).toEqual(400);
	expect(response.body).toEqual({
		errors: {
			caseEmail: 'Case email must be a valid email address',
			'applicant.address.postcode': 'Postcode must be a valid UK postcode',
			'applicant.email': 'Email must be a valid email',
			'applicant.phoneNumber': 'Phone Number must be a valid UK number',
			'geographicalInformation.gridReference.easting': 'Easting must be integer with 6 digits',
			'geographicalInformation.gridReference.northing': 'Northing must be integer with 6 digits',
			'geographicalInformation.mapZoomLevelName': 'Must be a valid map zoom level',
			'geographicalInformation.regionNames': 'Unknown region',
			'keyDates.preApplication.submissionAtInternal':
				'Submission date internal must be in the future',
			subSectorName: 'Must be existing sub-sector'
		}
	});
});

test('does not publish Service Bus events for training cases', async () => {
	// GIVEN
	databaseConnector.case.create.mockImplementation(
		mockApplicationGet({ ...createdCase, reference: 'TRAIN' })
	);
	databaseConnector.case.findUnique.mockImplementation(
		mockApplicationGet({ ...createdCase, reference: 'TRAIN' })
	);

	// WHEN
	const response = await request.post('/applications').send({
		title: 'some title',
		keyDates: {
			preApplication: {
				submissionAtInternal: 1_649_319_344_000
			}
		}
	});

	// THEN
	expect(response.status).toEqual(200);
	expect(eventClient.sendEvents).not.toHaveBeenCalled();
});
