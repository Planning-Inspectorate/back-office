import { applicationFactoryForTests } from '../../../utils/application-factory-for-tests.js';
import { buildNsipProjectPayload } from '#infrastructure/payload-builders/nsip-project.js';
import { validateNsipProject } from '../../../utils/schema-test-utils.js';

describe('Application', () => {
	test('buildNsipProjectPayload maps NSIP Case to NSIP Application Payload with minimum payload', () => {
		// 1. Arrange
		const projectEntity = { id: 1, title: 'EN010003 - NI Case 3 Name' };

		// 2. Act
		// @ts-ignore
		const result = buildNsipProjectPayload(projectEntity);

		// 3. Assert
		const expectedResult = {
			caseId: 1,
			sourceSystem: 'back-office-applications',
			projectName: 'EN010003 - NI Case 3 Name',
			publishStatus: 'unpublished',
			// These are likely to change
			nsipOfficerIds: [],
			nsipAdministrationOfficerIds: [],
			inspectorIds: []
		};

		// We're parsing the JSON and then stringifying it again to ensure that the date object is serialised as a string.
		expect(validateNsipProject(result)).toEqual(true);
		expect(expectedResult).toEqual(result);
	});

	test('buildNsipProjectPayload maps NSIP Case to NSIP Application Payload', () => {
		// 1. Arrange
		/** @type {import('@pins/applications.api').Schema.Case} */
		const projectEntity = applicationFactoryForTests({
			id: 1,
			title: 'EN010003 - NI Case 3 Name',
			description: 'EN010003 - NI Case 3 Name Description',
			caseStatus: 'draft',
			reference: 'EN01-243058',
			inclusions: {
				applicant: true,
				ApplicationDetails: true,
				CaseStatus: true,
				gridReference: true,
				mapZoomLevel: true,
				subSector: true
			}
		});

		// @ts-ignore
		projectEntity.ApplicationDetails.datePINSFirstNotifiedOfProject = new Date(
			'2022-07-22T10:38:33.000Z'
		);

		// 2. Act
		const result = buildNsipProjectPayload(projectEntity);

		// 3. Assert
		const expectedResult = {
			caseId: 1,
			caseReference: 'EN01-243058',
			projectName: 'EN010003 - NI Case 3 Name',
			projectDescription: 'EN010003 - NI Case 3 Name Description',
			publishStatus: 'unpublished',
			sourceSystem: 'back-office-applications',
			stage: 'draft',
			projectLocation: 'Some Location',
			projectEmailAddress: 'test@test.com',
			regions: ['north_west', 'south_west'],
			welshLanguage: false,
			mapZoomLevel: 'country',
			easting: 123_456,
			northing: 654_321,
			anticipatedDateOfSubmission: new Date('2022-07-22T10:38:33.000Z'),
			anticipatedSubmissionDateNonSpecific: 'Q1 2023',
			datePINSFirstNotifiedOfProject: new Date('2022-07-22T10:38:33.000Z'),
			sector: 'BC - Business and Commercial',
			projectType: 'BC01 - Office Use',
			applicantId: '1',
			nsipOfficerIds: [],
			nsipAdministrationOfficerIds: [],
			inspectorIds: []
		};

		expect(validateNsipProject(result)).toEqual(true);
		expect(expectedResult).toEqual(result);
	});
});
