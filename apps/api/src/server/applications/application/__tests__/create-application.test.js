import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const request = supertest(app);

const createStub = sinon.stub().returns({ id: 1, serviceCustomer: [{ id: 4 }] });

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
});

test('creates new application with just title and first notified date', async (t) => {
	const response = await request.post('/applications').send({
		title: 'some title',
		keyDates: {
			firstNotifiedDate: 123_456_789
		}
	});

	t.is(response.status, 200);
	t.deepEqual(response.body, { id: 1, applicantIds: [4] });
	sinon.assert.calledWith(createStub, {
		data: {
			title: 'some title',
			ApplicationDetails: {
				create: {
					firstNotifiedAt: new Date(123_456_789)
				}
			},
			CaseStatus: {
				create: {
					status: 'draft'
				}
			}
		},
		include: {
			serviceCustomer: true
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
	t.deepEqual(response.body, { id: 1, applicantIds: [4] });
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
			},
			CaseStatus: {
				create: {
					status: 'draft'
				}
			}
		},
		include: {
			serviceCustomer: true
		}
	});
});

test('creates new application when all possible details provided', async (t) => {
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
			regionNames: ['region1', 'region2'],
			gridReference: {
				easting: '123456',
				northing: '987654'
			}
		},
		keyDates: {
			firstNotifiedDate: 123,
			submissionDate: 1_689_262_804_000
		}
	});

	t.is(response.status, 200);
	t.deepEqual(response.body, { id: 1, applicantIds: [4] });
	sinon.assert.calledWith(createStub, {
		data: {
			title: 'title',
			description: 'description',
			gridReference: { create: { easting: 123_456, northing: 987_654 } },
			ApplicationDetails: {
				create: {
					caseEmail: 'caseEmail@pins.com',
					zoomLevel: { connect: { name: 'some-known-map-zoom-level' } },
					locationDescription: 'location description',
					firstNotifiedAt: new Date(123),
					submissionAt: new Date(1_689_262_804_000),
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
		},
		include: {
			serviceCustomer: true
		}
	});
});

test('creates new application when all possible details provided', async (t) => {
	const response = await request.post('/applications').send({
		title: 'title',
		description: 'description',
		subSectorName: 'some_sub_sector',
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
			regionNames: ['region1', 'region2'],
			gridReference: {
				easting: '123456',
				northing: '987654'
			}
		},
		keyDates: {
			firstNotifiedDate: 123,
			submissionDate: 1_689_262_804_000
		}
	});

	t.is(response.status, 200);
	t.deepEqual(response.body, { id: 1, applicantIds: [4] });
	sinon.assert.calledWith(createStub, {
		data: {
			title: 'title',
			description: 'description',
			gridReference: { create: { easting: 123_456, northing: 987_654 } },
			ApplicationDetails: {
				create: {
					caseEmail: 'caseEmail@pins.com',
					zoomLevel: { connect: { name: 'some-known-map-zoom-level' } },
					locationDescription: 'location description',
					firstNotifiedAt: new Date(123),
					submissionAt: new Date(1_689_262_804_000),
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
		},
		include: {
			serviceCustomer: true
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
			mapZoomLevelName: 'some-known-map-zoom-level'
		}
	});

	t.is(response.status, 200);
	t.deepEqual(response.body, { id: 1, applicantIds: [4] });
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
					zoomLevel: { connect: { name: 'some-known-map-zoom-level' } }
				}
			},
			CaseStatus: {
				create: {
					status: 'draft'
				}
			},
		},
		include: {
			serviceCustomer: true
		}
	});
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
			caseEmail: 'Case email must be a valid email address',
			'applicant.address.postcode': 'Postcode must be a valid UK postcode',
			'applicant.email': 'Email must be a valid email',
			'applicant.phoneNumber': 'Phone Number must be a valid UK number',
			'geographicalInformation.gridReference.easting': 'Easting must be integer with 6 digits',
			'geographicalInformation.gridReference.northing': 'Northing must be integer with 6 digits',
			'geographicalInformation.mapZoomLevelName': 'Must be a valid map zoom level',
			'geographicalInformation.regionNames': 'Unknown region',
			'keyDates.firstNotifiedDate': 'First notified date must be in the past',
			'keyDates.submissionDate': 'Submission date must be in the future',
			subSectorName: 'Must be existing sub-sector'
		}
	});
});
