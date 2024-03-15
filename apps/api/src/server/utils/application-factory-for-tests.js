import { buildInclusionsFromQuery } from '#utils/schema-test-utils.js';

/**
 * @returns {string}
 */
const generateApplicationReference = () => {
	const number = Math.floor(Math.random() * (1 - 999_999) + 1);

	return `EN01${number}`;
};

const applicant = {
	id: 1,
	caseId: 1,
	firstName: 'Service Customer First Name',
	middleName: 'Service Customer Middle Name',
	lastName: 'Service Customer Last Name',
	email: 'service.customer@email.com',
	website: 'Service Customer Website',
	phoneNumber: '01234567890',
	organisationName: 'Organisation',
	addressId: 1,
	address: {
		id: 1,
		addressLine1: 'Addr Line 1',
		addressLine2: 'Addr Line 2',
		town: 'Town',
		county: 'County',
		postcode: 'Postcode',
		country: 'Country'
	}
};

/**
 *
 * @param {{regions?: boolean, mapZoomLevel?: boolean, subSector?: boolean}} param0
 * @returns {import('@pins/applications.api').Schema.ApplicationDetails}
 */
const getApplicationDetails = ({ regions = true, mapZoomLevel = true, subSector = true }) => {
	return {
		id: 1,
		caseId: 1,
		caseEmail: 'test@test.com',
		locationDescription: 'Some Location',
		...(regions && {
			regions: [
				{
					region: {
						id: 1,
						name: 'north_west',
						displayNameEn: 'North West',
						displayNameCy: 'North West'
					}
				},
				{
					region: {
						id: 2,
						name: 'south_west',
						displayNameEn: 'South West',
						displayNameCy: 'South West'
					}
				}
			]
		}),
		zoomLevelId: mapZoomLevel ? 1 : null,
		...(mapZoomLevel && {
			zoomLevel: {
				id: 1,
				displayOrder: 900,
				name: 'country',
				displayNameEn: 'Country',
				displayNameCy: 'Country'
			}
		}),
		subSectorId: subSector ? 1 : null,
		...(subSector && {
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
			}
		}),
		datePINSFirstNotifiedOfProject: null,
		dateProjectAppearsOnWebsite: null,
		submissionAtInternal: new Date(1_658_486_313_000),
		submissionAtPublished: 'Q1 2023',
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
		dateProjectWithdrawn: null
	};
};

/**
 *
 * @param {{
 *  id: number,
 *  applicantId?: number | undefined,
 *  title: string | null,
 *  description: string | null,
 *  caseStatus: string,
 *  reference?: string | undefined,
 *  dates?: {createdAt?: Date, modifiedAt?: Date, publishedAt?: Date},
 *  inclusions?: {applicant?: boolean, ApplicationDetails?: boolean, regions?: boolean, CaseStatus?: boolean, mapZoomLevel?: boolean, subSector?: boolean, gridReference?: boolean}
 * }} arg
 * @returns {import('@pins/applications.api').Schema.Case}
 */
export const applicationFactoryForTests = ({
	id,
	applicantId = 1,
	title,
	description,
	caseStatus,
	reference,
	dates = {},
	inclusions = {}
}) => {
	return {
		id,
		applicantId: applicantId ?? applicant?.id ?? null,
		reference: reference || generateApplicationReference(),
		title,
		description,
		createdAt: dates.createdAt || new Date(),
		modifiedAt: dates.modifiedAt || new Date(),
		CaseStatus: [
			{
				id: 1,
				status: caseStatus,
				valid: true
			}
		],
		...(dates?.publishedAt && {
			CasePublishedState: [
				{
					id: 1,
					createdAt: dates.publishedAt,
					isPublished: true
				}
			]
		}),
		...(inclusions.gridReference && {
			gridReference: {
				id: 1,
				easting: 123456,
				northing: 654321
			}
		}),
		...(inclusions.applicant && { applicant: applicant }),
		...(inclusions.ApplicationDetails && {
			ApplicationDetails: getApplicationDetails({
				regions: inclusions.regions,
				mapZoomLevel: inclusions.mapZoomLevel,
				subSector: inclusions.subSector
			})
		})
	};
};

export const mockApplicationGet = (factoryOptions = {}, otherOptions = {}) => {
	return (query) => {
		const result = applicationFactoryForTests({
			inclusions: buildInclusionsFromQuery(query),
			...factoryOptions
		});
		return { ...result, ...otherOptions };
	};
};
