// @ts-nocheck
import { jest } from '@jest/globals';
import { NSIP_PROJECT, SERVICE_USER } from '#infrastructure/topics.js';
import { mockApplicationGet } from '#utils/application-factory-for-tests.js';
import { buildPayloadEventsForSchema } from '#utils/schema-test-utils.js';
const { request } = await import('../../../app-test.js');
const { databaseConnector } = await import('#utils/database-connector.js');
const { eventClient } = await import('#infrastructure/event-client.js');

const mockCase = {
	id: 1,
	reference: 'BC01234',
	title: 'some title',
	description: 'some description'
};

const expectedNsipProjectPayload = buildPayloadEventsForSchema(NSIP_PROJECT, {
	caseId: 1,
	projectName: 'some title',
	projectDescription: 'some description',
	projectType: 'BC01 - Office Use',
	sourceSystem: 'back-office-applications',
	publishStatus: 'unpublished',
	caseReference: 'BC01234',
	applicantId: '1',
	nsipOfficerIds: [],
	nsipAdministrationOfficerIds: [],
	inspectorIds: [],
	anticipatedDateOfSubmission: '2022-07-22T10:38:33.000Z',
	anticipatedSubmissionDateNonSpecific: 'Q1 2023',
	sector: 'BC - Business and Commercial',
	mapZoomLevel: 'country',
	easting: 123456,
	northing: 654321,
	projectEmailAddress: 'test@test.com',
	projectLocation: 'Some Location',
	regions: ['north_west', 'south_west'],
	stage: 'draft',
	welshLanguage: false
});

const expectedApplicantPayload = buildPayloadEventsForSchema(SERVICE_USER, {
	id: '1',
	sourceSuid: '1',
	sourceSystem: 'back-office-applications',
	caseReference: 'BC01234',
	serviceUserType: 'Applicant',
	organisation: 'Organisation',
	firstName: 'Service Customer First Name',
	lastName: 'Service Customer Last Name',
	emailAddress: 'service.customer@email.com',
	telephoneNumber: '01234567890',
	webAddress: 'Service Customer Website',
	addressCountry: 'Country',
	addressCounty: 'County',
	addressLine1: 'Addr Line 1',
	addressLine2: 'Addr Line 2',
	addressTown: 'Town',
	postcode: 'Postcode'
});

describe('Update application', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('update-application updates application with just title and first notified date', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockImplementation(mockApplicationGet(mockCase));

		databaseConnector.case.update.mockResolvedValue({});
		jest.useFakeTimers({ doNotFake: ['performance'], now: 1_649_319_144_000 });

		// WHEN
		const response = await request.patch('/applications/1').send({
			title: 'some title',
			description: 'some description',
			keyDates: {
				preApplication: {
					submissionAtInternal: 1_649_319_344_000
				}
			}
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({ id: 1, applicantId: 1 });
		expect(databaseConnector.case.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				modifiedAt: new Date(1_649_319_144_000),
				title: 'some title',
				description: 'some description',
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
				applicant: true
			}
		});

		expect(eventClient.sendEvents).toHaveBeenCalledTimes(2);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			1,
			NSIP_PROJECT,
			expectedNsipProjectPayload,
			'Update'
		);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			2,
			SERVICE_USER,
			expectedApplicantPayload,
			'Update',
			{ entityType: 'Applicant' }
		);
	});

	test('update-application updates application with just easting and sub-sector name', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockImplementation(mockApplicationGet(mockCase));

		databaseConnector.case.update.mockResolvedValue({});
		databaseConnector.subSector.findUnique.mockResolvedValue({});
		jest.useFakeTimers({ doNotFake: ['performance'], now: 1_649_319_144_000 });

		// WHEN
		const response = await request.patch('/applications/1').send({
			geographicalInformation: {
				gridReference: {
					easting: 123_456
				}
			},
			subSectorName: 'some_sub_sector'
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({ id: 1, applicantId: 1 });
		expect(databaseConnector.case.update).toHaveBeenCalledWith({
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
				applicant: true
			}
		});

		expect(eventClient.sendEvents).toHaveBeenCalledTimes(2);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			1,
			NSIP_PROJECT,
			expectedNsipProjectPayload,
			'Update'
		);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			2,
			SERVICE_USER,
			expectedApplicantPayload,
			'Update',
			{ entityType: 'Applicant' }
		);
	});

	test('update-application updates application when all possible details provided', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockImplementation(mockApplicationGet(mockCase));

		databaseConnector.applicationDetails.findUnique.mockResolvedValue({ id: 1, caseId: 1 });

		databaseConnector.case.update.mockResolvedValue({});
		databaseConnector.subSector.findUnique.mockResolvedValue({});
		databaseConnector.zoomLevel.findUnique.mockResolvedValue({});
		databaseConnector.region.findUnique({});
		jest.useFakeTimers({ doNotFake: ['performance'], now: 1_649_319_144_000 });

		// WHEN
		const response = await request.patch('/applications/1').send({
			title: 'title',
			description: 'description',
			subSectorName: 'some_sub_sector',
			caseEmail: 'caseEmail@pins.com',
			applicant: {
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
			},
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
				preApplication: {
					submissionAtInternal: 1_649_319_344_000,
					submissionAtPublished: 'Q1 2023'
				}
			}
		});

		// THEN
		expect(response.body).toEqual({ id: 1, applicantId: 1 });
		expect(response.status).toEqual(200);
		expect(databaseConnector.applicationDetails.findUnique).toHaveBeenCalledWith({
			where: { caseId: 1 }
		});
		expect(databaseConnector.regionsOnApplicationDetails.deleteMany).toHaveBeenCalledWith({
			where: { applicationDetailsId: 1 }
		});

		expect(databaseConnector.serviceUser.update).toHaveBeenCalledWith({
			where: { id: 1 },
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
			}
		});

		expect(databaseConnector.case.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				applicantId: 1,
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
				}
			},
			include: {
				applicant: true
			}
		});

		expect(eventClient.sendEvents).toHaveBeenCalledTimes(2);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			1,
			NSIP_PROJECT,
			expectedNsipProjectPayload,
			'Update'
		);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			2,
			SERVICE_USER,
			expectedApplicantPayload,
			'Update',
			{ entityType: 'Applicant' }
		);
	});

	test(`update-application with new applicant using first and last name,
			address line, map zoom level, blank case email`, async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockImplementation(mockApplicationGet(mockCase));

		databaseConnector.zoomLevel.findUnique.mockResolvedValue({});
		databaseConnector.case.update.mockResolvedValue({});

		jest.useFakeTimers({ doNotFake: ['performance'], now: 1_649_319_144_000 });

		// WHEN
		const response = await request.patch('/applications/1').send({
			applicant: {
				firstName: 'first',
				lastName: 'last',
				address: {
					addressLine1: 'some addr'
				}
			},
			geographicalInformation: {
				mapZoomLevelName: 'some-known-map-zoom-level'
			},
			caseEmail: ''
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({ id: 1, applicantId: 1 });
		expect(databaseConnector.case.update).toHaveBeenCalledWith({
			where: { id: 1 },
			data: {
				modifiedAt: new Date(1_649_319_144_000),
				ApplicationDetails: {
					upsert: {
						create: {
							caseEmail: null,
							zoomLevel: { connect: { name: 'some-known-map-zoom-level' } }
						},
						update: {
							caseEmail: null,
							zoomLevel: { connect: { name: 'some-known-map-zoom-level' } }
						}
					}
				}
			},
			include: {
				applicant: true
			}
		});

		expect(databaseConnector.serviceUser.create).toHaveBeenCalledWith({
			data: {
				firstName: 'first',
				lastName: 'last',
				address: { create: { addressLine1: 'some addr' } }
			}
		});

		expect(eventClient.sendEvents).toHaveBeenCalledTimes(2);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			1,
			NSIP_PROJECT,
			expectedNsipProjectPayload,
			'Update'
		);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			2,
			SERVICE_USER,
			expectedApplicantPayload,
			'Update',
			{ entityType: 'Applicant' }
		);
	});

	test('update-application returns error if any validated values are invalid', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockImplementation(mockApplicationGet(mockCase));

		databaseConnector.zoomLevel.findUnique.mockResolvedValue(null);
		databaseConnector.region.findUnique.mockResolvedValue(null);
		databaseConnector.subSector.findUnique.mockResolvedValue(null);
		databaseConnector.case.update.mockResolvedValue({});

		jest.useFakeTimers({ doNotFake: ['performance'], now: 1_649_319_144_000 });

		// WHEN
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
			applicant: {
				email: 'not a real email',
				phoneNumber: '10235',
				address: {
					postcode: '191187'
				}
			},
			keyDates: {
				preApplication: {
					submissionAtInternal: 100_000
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

	test('update-application throws error if unknown application id provided', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request.patch('/applications/2');

		// THEN
		expect(response.status).toEqual(404);
		expect(response.body).toEqual({
			errors: {
				id: 'Must be an existing application'
			}
		});
	});

	test('update-application throws error if unknown applicant id provided', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockImplementation(mockApplicationGet(mockCase));

		// WHEN
		const response = await request.patch('/applications/1').send({ applicant: { id: 3 } });

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				'applicant.id': 'Must be existing applicant that belongs to this case'
			}
		});
	});

	test('update-application throws error if applicant id that doesnt belong to case provided', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockImplementation(
			mockApplicationGet(mockCase, { applicant: { id: 4 } })
		);

		// WHEN
		const response = await request.patch('/applications/1').send({ applicant: { id: 1 } });

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				'applicant.id': 'Must be existing applicant that belongs to this case'
			}
		});
	});

	test('does not publish Service Bus events for training cases', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockImplementation(
			mockApplicationGet({
				id: 1,
				reference: 'TRAIN'
			})
		);

		databaseConnector.case.update.mockResolvedValue({});
		jest.useFakeTimers({ doNotFake: ['performance'], now: 1_649_319_144_000 });

		// WHEN
		const response = await request.patch('/applications/1').send({
			title: 'some title',
			keyDates: {
				preApplication: {
					submissionAtInternal: 1_649_319_344_000
				}
			}
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(eventClient.sendEvents).not.toHaveBeenCalledWith(NSIP_PROJECT);
	});
});
