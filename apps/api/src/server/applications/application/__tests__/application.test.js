import { applicationFactoryForTests } from '#utils/application-factory-for-tests.js';
import { buildNsipProjectPayload } from '#infrastructure/payload-builders/nsip-project.js';
import { validateMessageToSchema, validateNsipProject } from '#utils/schema-test-utils.js';

describe('Application', () => {
	test('buildNsipProjectPayload maps NSIP Case with minimum data to NSIP Application Full Payload', async () => {
		// 1. Arrange
		const projectEntity = {
			id: 1,
			title: 'EN010003 - NI Case 3 Name',
			reference: 'TEST',
			description: 'test project',
			sourceSystem: 'back-office-applications',
			ApplicationDetails: {
				id: 1,
				caseId: 1,
				subSectorId: 1,
				locationDescription: 'loca',
				zoomLevelId: 6,
				caseEmail: null,
				datePINSFirstNotifiedOfProject: null,
				dateProjectAppearsOnWebsite: null,
				submissionAtPublished: '',
				submissionAtInternal: null,
				screeningOpinionSought: null,
				screeningOpinionIssued: null,
				scopingOpinionSought: null,
				scopingOpinionIssued: null,
				section46Notification: null,
				dateOfDCOSubmission: null,
				deadlineForAcceptanceDecision: null,
				dateOfDCOAcceptance: null,
				dateOfNonAcceptance: null,
				dateOfRepresentationPeriodOpen: null,
				dateOfRelevantRepresentationClose: null,
				extensionToDateRelevantRepresentationsClose: null,
				dateRRepAppearOnWebsite: null,
				dateIAPIDue: null,
				rule6LetterPublishDate: null,
				preliminaryMeetingStartDate: null,
				notificationDateForPMAndEventsDirectlyFollowingPM: null,
				notificationDateForEventsApplicant: null,
				dateSection58NoticeReceived: null,
				confirmedStartOfExamination: null,
				rule8LetterPublishDate: null,
				deadlineForCloseOfExamination: null,
				dateTimeExaminationEnds: null,
				stage4ExtensionToExamCloseDate: null,
				deadlineForSubmissionOfRecommendation: null,
				dateOfRecommendations: null,
				stage5ExtensionToRecommendationDeadline: null,
				deadlineForDecision: null,
				confirmedDateOfDecision: null,
				stage5ExtensionToDecisionDeadline: null,
				jRPeriodEndDate: null,
				dateProjectWithdrawn: null,
				dateOfReOpenRelevantRepresentationStart: null,
				dateOfReOpenRelevantRepresentationClose: null,
				subSector: {
					id: 1,
					abbreviation: 'BC01',
					name: 'office_use',
					displayNameEn: 'Office Use',
					displayNameCy: 'Office Use',
					sectorId: 1,
					sector: {
						id: 1,
						abbreviation: 'BC',
						name: 'business_and_commercial',
						displayNameEn: 'Business and Commercial',
						displayNameCy: 'Business and Commercial'
					}
				},
				zoomLevel: {
					id: 6,
					name: 'none',
					displayOrder: 0,
					displayNameEn: 'None',
					displayNameCy: 'None'
				}
			},
			CaseStatus: [
				{
					id: 79,
					status: 'draft',
					valid: true,
					caseId: 1
				}
			],
			gridReference: { id: 3, easting: 123456, northing: 654321, caseId: 100000078 }
		};

		// 2. Act
		// @ts-ignore
		const payloadResult = buildNsipProjectPayload(projectEntity);

		// 3. Assert
		const expectedPayload = {
			caseId: 1,
			caseReference: 'TEST',
			projectName: 'EN010003 - NI Case 3 Name',
			projectDescription: 'test project',
			publishStatus: 'unpublished',
			sourceSystem: 'back-office-applications',
			stage: 'draft',
			projectLocation: 'loca',
			projectEmailAddress: null,
			regions: [],
			easting: 123456,
			northing: 654321,
			welshLanguage: false,
			mapZoomLevel: 'none',
			secretaryOfState: null,
			anticipatedDateOfSubmission: null,
			anticipatedSubmissionDateNonSpecific: '',
			datePINSFirstNotifiedOfProject: null,
			dateProjectAppearsOnWebsite: null,
			screeningOpinionSought: null,
			screeningOpinionIssued: null,
			scopingOpinionSought: null,
			scopingOpinionIssued: null,
			section46Notification: null,
			dateOfDCOSubmission: null,
			deadlineForAcceptanceDecision: null,
			dateOfDCOAcceptance: null,
			dateOfNonAcceptance: null,
			dateOfRepresentationPeriodOpen: null,
			dateOfRelevantRepresentationClose: null,
			extensionToDateRelevantRepresentationsClose: null,
			dateOfReOpenRelevantRepresentationStart: null,
			dateOfReOpenRelevantRepresentationClose: null,
			dateRRepAppearOnWebsite: null,
			dateIAPIDue: null,
			rule6LetterPublishDate: null,
			preliminaryMeetingStartDate: null,
			notificationDateForPMAndEventsDirectlyFollowingPM: null,
			notificationDateForEventsApplicant: null,
			dateSection58NoticeReceived: null,
			confirmedStartOfExamination: null,
			rule8LetterPublishDate: null,
			deadlineForCloseOfExamination: null,
			dateTimeExaminationEnds: null,
			stage4ExtensionToExamCloseDate: null,
			deadlineForSubmissionOfRecommendation: null,
			dateOfRecommendations: null,
			stage5ExtensionToRecommendationDeadline: null,
			deadlineForDecision: null,
			confirmedDateOfDecision: null,
			stage5ExtensionToDecisionDeadline: null,
			jRPeriodEndDate: null,
			dateProjectWithdrawn: null,
			notificationDateForEventsDeveloper: null,
			transboundary: null,
			decision: null,
			sector: 'BC - Business and Commercial',
			projectType: 'BC01 - Office Use',
			applicantId: null,
			operationsLeadId: null,
			operationsManagerId: null,
			caseManagerId: null,
			nsipOfficerIds: [],
			nsipAdministrationOfficerIds: [],
			leadInspectorId: null,
			inspectorIds: [],
			environmentalServicesOfficerId: null,
			legalOfficerId: null,
			migrationStatus: null
		};

		// Expect payload:
		expect(expectedPayload).toEqual(payloadResult);

		// We're parsing the JSON and then stringifying it again to ensure that the date object is serialised as a string.
		expect(validateNsipProject(payloadResult)).toEqual(true);

		const isValidToSchema = await validateMessageToSchema(
			'nsip-project.schema.json',
			payloadResult
		);
		expect(isValidToSchema).toEqual(true);
	});

	test('buildNsipProjectPayload maps NSIP Case factory test data to NSIP Application Full Payload', async () => {
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

		if (projectEntity.ApplicationDetails) {
			projectEntity.ApplicationDetails = {
				...projectEntity.ApplicationDetails,
				datePINSFirstNotifiedOfProject: new Date('2022-07-22T10:38:33.000Z'),
				dateProjectAppearsOnWebsite: null,
				submissionAtPublished: '',
				submissionAtInternal: null,
				screeningOpinionSought: null,
				screeningOpinionIssued: null,
				scopingOpinionSought: null,
				scopingOpinionIssued: null,
				section46Notification: null,
				dateOfDCOSubmission: null,
				deadlineForAcceptanceDecision: null,
				dateOfDCOAcceptance: null,
				dateOfNonAcceptance: null,
				dateOfRepresentationPeriodOpen: null,
				dateOfRelevantRepresentationClose: null,
				extensionToDateRelevantRepresentationsClose: null,
				dateRRepAppearOnWebsite: null,
				dateIAPIDue: null,
				rule6LetterPublishDate: null,
				preliminaryMeetingStartDate: null,
				notificationDateForPMAndEventsDirectlyFollowingPM: null,
				notificationDateForEventsApplicant: null,
				dateSection58NoticeReceived: null,
				confirmedStartOfExamination: null,
				rule8LetterPublishDate: null,
				deadlineForCloseOfExamination: null,
				dateTimeExaminationEnds: null,
				stage4ExtensionToExamCloseDate: null,
				deadlineForSubmissionOfRecommendation: null,
				dateOfRecommendations: null,
				stage5ExtensionToRecommendationDeadline: null,
				deadlineForDecision: null,
				confirmedDateOfDecision: null,
				stage5ExtensionToDecisionDeadline: null,
				jRPeriodEndDate: null,
				dateProjectWithdrawn: null,
				dateOfReOpenRelevantRepresentationStart: null,
				dateOfReOpenRelevantRepresentationClose: null
			};
		}

		// 2. Act
		const payloadResult = buildNsipProjectPayload(projectEntity);

		// 3. Assert
		const expectedPayload = {
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
			easting: 123456,
			northing: 654321,
			welshLanguage: false,
			mapZoomLevel: 'country',
			secretaryOfState: null,
			anticipatedDateOfSubmission: null,
			anticipatedSubmissionDateNonSpecific: '',
			datePINSFirstNotifiedOfProject: new Date('2022-07-22T10:38:33.000Z').toISOString(),
			dateProjectAppearsOnWebsite: null,
			screeningOpinionSought: null,
			screeningOpinionIssued: null,
			scopingOpinionSought: null,
			scopingOpinionIssued: null,
			section46Notification: null,
			dateOfDCOSubmission: null,
			deadlineForAcceptanceDecision: null,
			dateOfDCOAcceptance: null,
			dateOfNonAcceptance: null,
			dateOfRepresentationPeriodOpen: null,
			dateOfRelevantRepresentationClose: null,
			extensionToDateRelevantRepresentationsClose: null,
			dateOfReOpenRelevantRepresentationStart: null,
			dateOfReOpenRelevantRepresentationClose: null,
			dateRRepAppearOnWebsite: null,
			dateIAPIDue: null,
			rule6LetterPublishDate: null,
			preliminaryMeetingStartDate: null,
			notificationDateForPMAndEventsDirectlyFollowingPM: null,
			notificationDateForEventsApplicant: null,
			dateSection58NoticeReceived: null,
			confirmedStartOfExamination: null,
			rule8LetterPublishDate: null,
			deadlineForCloseOfExamination: null,
			dateTimeExaminationEnds: null,
			stage4ExtensionToExamCloseDate: null,
			deadlineForSubmissionOfRecommendation: null,
			dateOfRecommendations: null,
			stage5ExtensionToRecommendationDeadline: null,
			deadlineForDecision: null,
			confirmedDateOfDecision: null,
			stage5ExtensionToDecisionDeadline: null,
			jRPeriodEndDate: null,
			dateProjectWithdrawn: null,
			notificationDateForEventsDeveloper: null,
			transboundary: null,
			decision: null,
			sector: 'BC - Business and Commercial',
			projectType: 'BC01 - Office Use',
			applicantId: '1',
			operationsLeadId: null,
			operationsManagerId: null,
			caseManagerId: null,
			nsipOfficerIds: [],
			nsipAdministrationOfficerIds: [],
			leadInspectorId: null,
			inspectorIds: [],
			environmentalServicesOfficerId: null,
			legalOfficerId: null,
			migrationStatus: null
		};

		// expect payload
		expect(expectedPayload).toEqual(payloadResult);

		// expect to validate against schema
		expect(validateNsipProject(payloadResult)).toEqual(true);

		// expect to validate against schema using broadcast method
		const isValidToSchema = await validateMessageToSchema(
			'nsip-project.schema.json',
			payloadResult
		);
		expect(isValidToSchema).toEqual(true);
	});
});
