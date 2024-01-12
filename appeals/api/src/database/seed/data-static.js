/**
 * Static data required by the back-office service
 */

/**
 * @typedef {import('@pins/appeals.api').Schema.ProcedureType} ProcedureType
 * @typedef {import('@pins/appeals.api').Schema.DesignatedSiteDetails} DesignatedSiteDetails
 * @typedef {import('@pins/appeals.api').Schema.LPANotificationMethodDetails} LPANotificationMethodDetails
 * @typedef {import('@pins/appeals.api').Schema.ScheduleType} ScheduleType
 * @typedef {import('@pins/appeals.api').Schema.PlanningObligationStatus} PlanningObligationStatus
 * @typedef {import('@pins/appeals.api').Schema.KnowledgeOfOtherLandowners} KnowledgeOfOtherLandowners
 * @typedef {import('@pins/appeals.api').Schema.AppellantCaseValidationOutcome} AppellantCaseValidationOutcome
 * @typedef {import('@pins/appeals.api').Schema.AppellantCaseIncompleteReason} AppellantCaseIncompleteReason
 * @typedef {import('@pins/appeals.api').Schema.AppellantCaseInvalidReason} AppellantCaseInvalidReason
 * @typedef {import('@pins/appeals.api').Schema.LPAQuestionnaireValidationOutcome} LPAQuestionnaireValidationOutcome
 * @typedef {import('@pins/appeals.api').Schema.LPAQuestionnaireIncompleteReason} LPAQuestionnaireIncompleteReason
 * @typedef {import('@pins/appeals.api').Schema.SiteVisitType} SiteVisitType
 * @typedef {import('@pins/appeals.api').Schema.Specialism} Specialism
 * @typedef {import('@pins/appeals.api').Schema.DocumentRedactionStatus} DocumentRedactionStatus
 */

/**
 * Appeal types
 *
 */
export const appealTypes = [
	{ shorthand: 'HAS', type: 'Householder', code: 'D', enabled: true },
	{ shorthand: 'FPA', type: 'Planning appeal', code: 'A', enabled: false },
	{ shorthand: 'X1', type: 'Enforcement notice appeal', code: 'C', enabled: false },
	{
		shorthand: 'X2',
		type: 'Planned listed building and conservation area appeal',
		code: 'E',
		enabled: false
	},
	{
		shorthand: 'X3',
		type: 'Enforcement listed building and conservation area appeal',
		code: 'F',
		enabled: false
	},
	{ shorthand: 'X4', type: 'Discontinuance notice appeal', code: 'G', enabled: false },
	{ shorthand: 'X5', type: 'Advertisement appeal', code: 'H', enabled: false },
	{ shorthand: 'X6', type: 'Community infrastructure levy', code: 'L', enabled: false },
	{ shorthand: 'X7', type: 'Planning obligation appeal', code: 'Q', enabled: false },
	{ shorthand: 'X8', type: 'Affordable housing obligation appeal', code: 'S', enabled: false },
	{ shorthand: 'X9', type: 'Call-in application', code: 'V', enabled: false },
	{ shorthand: 'X10', type: 'Planning appeal (W)', code: 'W', enabled: false },
	{ shorthand: 'X11', type: 'Lawful development certificate appeal', code: 'X', enabled: false },
	{
		shorthand: 'X12',
		type: 'Planned listed building and conservation area appeal (Y)',
		code: 'Y',
		enabled: false
	},
	{ shorthand: 'X13', type: 'Commercial (CAS) appeal', code: 'Z', enabled: false }
];

/**
 * Seed static data into the database. Does not disconnect from the database or handle errors.
 * An array of procedure types.
 *
 * @type {ProcedureType[]}
 */
export const procedureTypes = [
	{
		name: 'Hearing'
	},
	{
		name: 'Inquiry'
	},
	{
		name: 'Written'
	}
];

/**
 * An array of designated sites.
 *
 * @type {DesignatedSiteDetails[]}
 */
export const designatedSites = [
	{
		name: 'cSAC',
		description: 'candidate special area of conservation'
	},
	{
		name: 'pSPA',
		description: 'potential special protection area'
	},
	{
		name: 'SAC',
		description: 'special area of conservation'
	},
	{
		name: 'SPA Ramsar',
		description: 'ramsar special protection area'
	},
	{
		name: 'SSSI',
		description: 'site of special scientific interest'
	},
	{
		name: 'Other',
		description: ''
	}
];

/**
 * An array of LPA notification methods.
 *
 * @type {LPANotificationMethodDetails[]}
 */
export const lpaNotificationMethods = [
	{
		name: 'A site notice'
	},
	{
		name: 'Letter/email to interested parties'
	},
	{
		name: 'A press advert'
	}
];

/**
 * An array of schedule types.
 *
 * @type {ScheduleType[]}
 */
export const scheduleTypes = [
	{
		name: 'Schedule 1'
	},
	{
		name: 'Schedule 2'
	}
];

/**
 * An array of planning obligation statuses.
 *
 * @type {Pick<PlanningObligationStatus, 'name'>[]}
 */
export const planningObligationStatuses = [
	{
		name: 'Finalised'
	},
	{
		name: 'Draft'
	},
	{
		name: 'Not started'
	}
];

/**
 * An array of knowledge of other landowners values.
 *
 * @type {Pick<KnowledgeOfOtherLandowners, 'name'>[]}
 */
export const knowledgeOfOtherLandownersValues = [
	{
		name: 'Yes'
	},
	{
		name: 'Some'
	},
	{
		name: 'No'
	}
];

/**
 * An array of appellant case validation outcomes.
 *
 * @type {Pick<AppellantCaseValidationOutcome, 'name'>[]}
 */
export const appellantCaseValidationOutcomes = [
	{
		name: 'Valid'
	},
	{
		name: 'Invalid'
	},
	{
		name: 'Incomplete'
	}
];

/**
 * An array of appellant case incomplete reasons.
 *
 * @type {Pick<AppellantCaseIncompleteReason, 'name' | 'hasText'>[]}
 */
export const appellantCaseIncompleteReasons = [
	{
		name: 'Appellant name is not the same on the application form and appeal form',
		hasText: false
	},
	{
		name: 'Attachments and/or appendices have not been included to the full statement of case',
		hasText: true
	},
	{
		name: "LPA's decision notice is missing",
		hasText: false
	},
	{
		name: "LPA's decision notice is incorrect or incomplete",
		hasText: true
	},
	{
		name: 'Documents and/or plans referred in the application form, decision notice and appeal covering letter are missing',
		hasText: true
	},
	{
		name: 'Agricultural holding certificate and declaration have not been completed on the appeal form',
		hasText: false
	},
	{
		name: 'The original application form is missing',
		hasText: false
	},
	{
		name: 'The original application form is incomplete',
		hasText: true
	},
	{
		name: 'Statement of case and ground of appeal are missing',
		hasText: false
	},
	{
		name: 'Other',
		hasText: true
	}
];

/**
 * An array of appellant case invalid reasons.
 *
 * @type {Pick<AppellantCaseInvalidReason, 'name' | 'hasText'>[]}
 */
export const appellantCaseInvalidReasons = [
	{
		name: 'Appeal has not been submitted on time',
		hasText: false
	},
	{
		name: 'Documents have not been submitted on time',
		hasText: false
	},
	{
		name: "The appellant doesn't have the right to appeal",
		hasText: false
	},
	{
		name: 'Other',
		hasText: true
	}
];

/**
 * An array of LPA questionnaire validation outcomes.
 *
 * @type {Pick<LPAQuestionnaireValidationOutcome, 'name'>[]}
 */
export const lpaQuestionnaireValidationOutcomes = [
	{
		name: 'Complete'
	},
	{
		name: 'Incomplete'
	}
];

/**
 * An array of LPA questionnaire incomplete reasons.
 *
 * @type {Pick<LPAQuestionnaireIncompleteReason, 'name' | 'hasText'>[]}
 */
export const lpaQuestionnaireIncompleteReasons = [
	{
		name: 'Policies are missing',
		hasText: true
	},
	{
		name: 'Other documents or information are missing',
		hasText: true
	},
	{
		name: 'Other',
		hasText: true
	}
];

/**
 * An array of site visit types.
 *
 * @type {Pick<SiteVisitType, 'name'>[]}
 */
export const siteVisitTypes = [
	{ name: 'Access required' },
	{ name: 'Accompanied' },
	{ name: 'Unaccompanied' }
];

/**
 * An array of specialisms.
 *
 * @type {Pick<Specialism, 'name'>[]}
 */

export const specialisms = [
	{ name: 'Schedule 1' },
	{ name: 'Schedule 2' },
	{ name: 'Enforcement' },
	{ name: 'General allocation' },
	{ name: 'Housing orders' },
	{ name: 'Rights of way' },
	{ name: 'Shopping' },
	{ name: 'Gypsy' },
	{ name: 'Housing' },
	{ name: 'Access' },
	{ name: 'Advertisements' },
	{ name: 'Appearance design' },
	{ name: 'Architecture design' },
	{ name: 'High hedges' },
	{ name: 'Historic heritage' },
	{ name: 'Listed building and enforcement' },
	{ name: 'Natural heritage' },
	{ name: 'Renewable energy/wind farms' },
	{ name: 'Roads and traffics' },
	{ name: 'Transport' },
	{ name: 'Tree preservation order' },
	{ name: 'Waste' },
	{ name: 'Water' }
];

/**
 * An array of document redaction statuses.
 *
 * @type {Pick<DocumentRedactionStatus, 'name'>[]}
 */
export const documentRedactionStatuses = [
	{
		name: 'Redacted'
	},
	{
		name: 'Unredacted'
	},
	{
		name: 'No redaction required'
	}
];

/**
 * Seed static data into the database. Does not disconnect from the database or handle errors.
 *
 * @param {import('../../server/utils/db-client/index.js').PrismaClient} databaseConnector
 */
export async function seedStaticData(databaseConnector) {
	const systemUserId = '00000000-0000-0000-0000-000000000000';

	await databaseConnector.user.upsert({
		where: {
			azureAdUserId: systemUserId
		},
		update: {},
		create: {
			azureAdUserId: systemUserId
		}
	});

	for (const appealType of appealTypes) {
		await databaseConnector.appealType.upsert({
			create: appealType,
			where: { shorthand: appealType.shorthand },
			update: { type: appealType.type }
		});
	}
	for (const procedureType of procedureTypes) {
		await databaseConnector.procedureType.upsert({
			create: procedureType,
			where: { name: procedureType.name },
			update: {}
		});
	}
	for (const designatedSite of designatedSites) {
		await databaseConnector.designatedSite.upsert({
			create: designatedSite,
			where: { name: designatedSite.name },
			update: {}
		});
	}
	for (const lpaNotificationMethod of lpaNotificationMethods) {
		await databaseConnector.lPANotificationMethods.upsert({
			create: lpaNotificationMethod,
			where: { name: lpaNotificationMethod.name },
			update: {}
		});
	}
	for (const scheduleType of scheduleTypes) {
		await databaseConnector.scheduleType.upsert({
			create: scheduleType,
			where: { name: scheduleType.name },
			update: {}
		});
	}
	for (const planningObligationStatus of planningObligationStatuses) {
		await databaseConnector.planningObligationStatus.upsert({
			create: planningObligationStatus,
			where: { name: planningObligationStatus.name },
			update: {}
		});
	}
	for (const knowledgeOfOtherLandownersValue of knowledgeOfOtherLandownersValues) {
		await databaseConnector.knowledgeOfOtherLandowners.upsert({
			create: knowledgeOfOtherLandownersValue,
			where: { name: knowledgeOfOtherLandownersValue.name },
			update: {}
		});
	}
	for (const appellantCaseValidationOutcome of appellantCaseValidationOutcomes) {
		await databaseConnector.appellantCaseValidationOutcome.upsert({
			create: appellantCaseValidationOutcome,
			where: { name: appellantCaseValidationOutcome.name },
			update: {}
		});
	}
	for (const appellantCaseIncompleteReason of appellantCaseIncompleteReasons) {
		await databaseConnector.appellantCaseIncompleteReason.upsert({
			create: appellantCaseIncompleteReason,
			where: { name: appellantCaseIncompleteReason.name },
			update: {}
		});
	}
	for (const appellantCaseInvalidReason of appellantCaseInvalidReasons) {
		await databaseConnector.appellantCaseInvalidReason.upsert({
			create: appellantCaseInvalidReason,
			where: { name: appellantCaseInvalidReason.name },
			update: {}
		});
	}
	for (const lpaQuestionnaireValidationOutcome of lpaQuestionnaireValidationOutcomes) {
		await databaseConnector.lPAQuestionnaireValidationOutcome.upsert({
			create: lpaQuestionnaireValidationOutcome,
			where: { name: lpaQuestionnaireValidationOutcome.name },
			update: {}
		});
	}
	for (const lpaQuestionnaireIncompleteReason of lpaQuestionnaireIncompleteReasons) {
		await databaseConnector.lPAQuestionnaireIncompleteReason.upsert({
			create: lpaQuestionnaireIncompleteReason,
			where: { name: lpaQuestionnaireIncompleteReason.name },
			update: {}
		});
	}
	for (const siteVisitType of siteVisitTypes) {
		await databaseConnector.siteVisitType.upsert({
			create: { name: siteVisitType.name },
			where: { name: siteVisitType.name },
			update: {}
		});
	}
	for (const specialism of specialisms) {
		await databaseConnector.specialism.upsert({
			create: { name: specialism.name },
			where: { name: specialism.name },
			update: {}
		});
	}
	for (const documentRedactionStatus of documentRedactionStatuses) {
		await databaseConnector.documentRedactionStatus.upsert({
			create: { name: documentRedactionStatus.name },
			where: { name: documentRedactionStatus.name },
			update: {}
		});
	}
}
