// @ts-nocheck
import { jest } from '@jest/globals';

/** @type {import('../application.js').NsipProjectPayload} */
const expectedEventPayload = {
	caseId: 1,
	sourceSystem: 'ODT',
	publishStatus: 'unpublished',
	applicantIds: ['2', '3'],
	nsipOfficerIds: [],
	nsipAdministrationOfficerIds: [],
	inspectorIds: [],
	interestedPartyIds: []
};

const { request } = await import('../../../app-test.js');
const { databaseConnector } = await import('../../../utils/database-connector.js');
const { eventClient } = await import('../../../infrastructure/event-client.js');

describe('Update application', () => {
	test('update-application updates application with just title and first notified date', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue({
			id: 1,
			serviceCustomer: [{ id: 2 }, { id: 3 }]
		});

		databaseConnector.case.update.mockResolvedValue({});
		jest.useFakeTimers({ now: 1_649_319_144_000 });

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
		expect(response.body).toEqual({ id: 1, applicantIds: [2, 3] });
		expect(databaseConnector.case.update).toHaveBeenCalledWith({
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

		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			'nsip-project',
			[expectedEventPayload],
			'Update'
		);
	});

	test('update-application updates application with just easting and sub-sector name', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue({
			id: 1,
			serviceCustomer: [{ id: 2 }, { id: 3 }]
		});

		databaseConnector.case.update.mockResolvedValue({});
		databaseConnector.subSector.findUnique.mockResolvedValue({});
		jest.useFakeTimers({ now: 1_649_319_144_000 });

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
		expect(response.body).toEqual({ id: 1, applicantIds: [2, 3] });
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
				serviceCustomer: true
			}
		});

		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			'nsip-project',
			[expectedEventPayload],
			'Update'
		);
	});

	test('update-application updates application when all possible details provided', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue({
			id: 1,
			serviceCustomer: [{ id: 2 }, { id: 3 }]
		});
		databaseConnector.applicationDetails.findUnique.mockResolvedValue({ id: 1, caseId: 1 });

		databaseConnector.case.update.mockResolvedValue({});
		databaseConnector.subSector.findUnique.mockResolvedValue({});
		databaseConnector.serviceCustomer.findUnique.mockResolvedValue({ caseId: 1 });
		databaseConnector.zoomLevel.findUnique.mockResolvedValue({});
		databaseConnector.region.findUnique({});
		jest.useFakeTimers({ now: 1_649_319_144_000 });

		// WHEN
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
				preApplication: {
					submissionAtInternal: 1_649_319_344_000,
					submissionAtPublished: 'Q1 2023'
				}
			}
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({ id: 1, applicantIds: [2, 3] });
		expect(databaseConnector.applicationDetails.findUnique).toHaveBeenCalledWith({
			where: { caseId: 1 }
		});
		expect(databaseConnector.regionsOnApplicationDetails.deleteMany).toHaveBeenCalledWith({
			where: { applicationDetailsId: 1 }
		});

		expect(databaseConnector.case.update).toHaveBeenCalledWith({
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

		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			'nsip-project',
			[expectedEventPayload],
			'Update'
		);
	});

	test(`update-application with new applicant using first and last name,
			address line, map zoom level`, async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue({
			id: 1,
			serviceCustomer: [{ id: 2 }, { id: 3 }]
		});

		databaseConnector.zoomLevel.findUnique.mockResolvedValue({});
		databaseConnector.case.update.mockResolvedValue({});

		jest.useFakeTimers({ now: 1_649_319_144_000 });

		// WHEN
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

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({ id: 1, applicantIds: [2, 3] });
		expect(databaseConnector.case.update).toHaveBeenCalledWith({
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

		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			'nsip-project',
			[expectedEventPayload],
			'Update'
		);
	});

	test('update-application returns error if any validated values are invalid', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue({
			id: 1,
			serviceCustomer: [{ id: 2 }, { id: 3 }]
		});

		databaseConnector.zoomLevel.findUnique.mockResolvedValue(null);
		databaseConnector.region.findUnique.mockResolvedValue(null);
		databaseConnector.subSector.findUnique.mockResolvedValue(null);
		databaseConnector.case.update.mockResolvedValue({});

		jest.useFakeTimers({ now: 1_649_319_144_000 });

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
				'applicants[0].address.postcode': 'Postcode must be a valid UK postcode',
				'applicants[0].email': 'Email must be a valid email',
				'applicants[0].phoneNumber': 'Phone Number must be a valid UK number',
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
		databaseConnector.case.findUnique.mockResolvedValue({
			id: 1,
			serviceCustomer: [{ id: 2 }, { id: 3 }]
		});
		databaseConnector.serviceCustomer.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request.patch('/applications/1').send({ applicants: [{ id: 3 }] });

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				'applicants[0].id': 'Must be existing applicant that belongs to this case'
			}
		});
	});

	test('update-application throws error if applicant id that doesnt belong to case provided', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue({
			id: 1,
			serviceCustomer: [{ id: 2 }, { id: 3 }]
		});
		databaseConnector.serviceCustomer.findUnique.mockResolvedValue({ caseId: 2 });

		// WHEN
		const response = await request.patch('/applications/1').send({ applicants: [{ id: 2 }] });

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				'applicants[0].id': 'Must be existing applicant that belongs to this case'
			}
		});
	});
});
