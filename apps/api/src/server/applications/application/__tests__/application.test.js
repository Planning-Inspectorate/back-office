import test from 'ava';
import { applicationFactoryForTests } from '../../../utils/application-factory-for-tests.js';
import { buildNsipProjectPayload } from '../application.js';
import { validateNsipProject } from './schema-test-utils.js';

test('buildNsipProjectPayload maps NSIP Case to NSIP Application Payload with minimum payload', (t) => {
	// 1. Arrange
	const projectEntity = { id: 1, title: 'EN010003 - NI Case 3 Name' };

	// 2. Act
	// @ts-ignore
	const result = buildNsipProjectPayload(projectEntity);

	// 3. Assert
	const expectedResult = {
		id: 1,
		caseTeams: [],
		customers: [],
		inspectors: [],
		sourceSystem: 'ODT',
		status: [],
		title: 'EN010003 - NI Case 3 Name',
		type: {
			code: 'application'
		},
		validationOfficers: []
	};

	// We're parsing the JSON and then stringifying it again to ensure that the date object is serialised as a string.
	t.deepEqual(validateNsipProject(result), true);
	t.deepEqual(result, expectedResult);
});
test('buildNsipProjectPayload maps NSIP Case to NSIP Application Payload', (t) => {
	// 1. Arrange
	/** @type {import('@pins/api').Schema.Case} */
	const projectEntity = applicationFactoryForTests({
		id: 1,
		title: 'EN010003 - NI Case 3 Name',
		description: 'EN010003 - NI Case 3 Name Description',
		caseStatus: 'draft',
		reference: 'EN01-243058',
		inclusions: {
			serviceCustomer: true,
			ApplicationDetails: true,
			CaseStatus: true,
			gridReference: true,
			mapZoomLevel: true,
			subSector: true
		}
	});

	// 2. Act
	const result = buildNsipProjectPayload(projectEntity);

	// 3. Assert
	/** @type {import('../application.js').NsipProjectPayload} */
	const expectedResult = {
		id: 1,
		reference: 'EN01-243058',
		title: 'EN010003 - NI Case 3 Name',
		description: 'EN010003 - NI Case 3 Name Description',
		type: {
			code: 'application'
		},
		status: [
			{
				status: 'draft'
			}
		],
		application: {
			caseEmail: 'test@test.com',
			siteAddress: 'Some Location',
			sector: {
				abbreviation: 'BB',
				name: 'sector',
				subSector: {
					abbreviation: 'AA',
					name: 'sub_sector'
				}
			},
			gridReference: {
				easting: 123_456,
				northing: 654_321
			},
			zoom: {
				name: 'zoom-level'
			},
			regions: [
				{
					name: 'region1'
				},
				{
					name: 'region2'
				}
			],
			// @ts-ignore - for some reason, nullable dates are being picked up
			keyDates: {
				anticipatedSubmissionDate: new Date('2022-07-22T10:38:33.000Z'),
				anticipatedSubmissionDateNonSpecific: 'Q1 2023'
			}
		},
		customers: [
			{
				id: 1,
				customerType: 'applicant',
				name: 'Organisation',
				firstName: 'Service Customer First Name',
				lastName: 'Service Customer Last Name',
				address: {
					addressLine1: 'Addr Line 1',
					addressLine2: 'Addr Line 2',
					town: 'Town',
					county: 'County',
					postcode: 'Postcode'
				},
				phoneNumber: '01234567890',
				email: 'service.customer@email.com',
				website: 'Service Customer Website'
			}
		],
		validationOfficers: [],
		caseTeams: [],
		inspectors: [],
		sourceSystem: 'ODT'
	};

	t.deepEqual(validateNsipProject(result), true);
	t.deepEqual(result, expectedResult);
});
