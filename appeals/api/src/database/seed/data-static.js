/**
 * Static data required by the back-office service
 */

/**
 * @typedef {import('appeals/api/src/database/schema.js').ProcedureType} ProcedureType
 * @typedef {import('appeals/api/src/database/schema.js').DesignatedSiteDetails} DesignatedSiteDetails
 * @typedef {import('appeals/api/src/database/schema.js').LPANotificationMethodDetails} LPANotificationMethodDetails
 * @typedef {import('appeals/api/src/database/schema.js').ScheduleType} ScheduleType
 * @typedef {import('appeals/api/src/database/schema.js').PlanningObligationStatus} PlanningObligationStatus
 * @typedef {import('appeals/api/src/database/schema.js').KnowledgeOfOtherLandowners} KnowledgeOfOtherLandowners
 * @typedef {import('appeals/api/src/database/schema.js').ValidationOutcome} ValidationOutcome
 * @typedef {import('appeals/api/src/database/schema.js').AppellantCaseIncompleteReason} AppellantCaseIncompleteReason
 * @typedef {import('appeals/api/src/database/schema.js').AppellantCaseInvalidReason} AppellantCaseInvalidReason
 */

/**
 * Appeal tyles
 *
 */
export const appealTypes = [
	{ shorthand: 'FPA', type: 'Full planning' },
	{ shorthand: 'HAS', type: 'Householder' }
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
 * An array of knowledge of validation outcomes.
 *
 * @type {Pick<ValidationOutcome, 'name'>[]}
 */
export const validationOutcomes = [
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
 * An array of knowledge of appellant case incomplete reasons.
 *
 * @type {Pick<AppellantCaseIncompleteReason, 'name'>[]}
 */
export const appellantCaseIncompleteReasons = [
	{
		name: 'Appellant name is not the same on the application form and appeal form'
	},
	{
		name: 'Attachments and/or appendices have not been included to the full statement of case'
	},
	{
		name: "LPA's decision notice is incorrect or incomplete"
	},
	{
		name: 'Documents and plans referred in the application form, decision notice and appeal covering letter are missing'
	},
	{
		name: 'Site ownership certificate, agricultural holding certificate and declaration have not been completed on the appeal form'
	},
	{
		name: 'The original application form is incomplete or missing'
	},
	{
		name: 'Statement of case and ground of appeal are missing'
	},
	{
		name: 'Other'
	}
];

/**
 * An array of knowledge of appellant case invalid reasons.
 *
 * @type {Pick<AppellantCaseInvalidReason, 'name'>[]}
 */
export const appellantCaseInvalidReasons = [
	{
		name: 'Appeal has not been submitted on time'
	},
	{
		name: 'Documents have not been submitted on time'
	},
	{
		name: "The appellant doesn't have the right to appeal"
	},
	{
		name: 'Other'
	}
];

/**
 * eed static data into the database. Does not disconnect from the database or handle errors.
 *
 * @param {import('@prisma/client').PrismaClient} databaseConnector
 */
export async function seedStaticData(databaseConnector) {
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
	for (const validationOutcome of validationOutcomes) {
		await databaseConnector.validationOutcome.upsert({
			create: validationOutcome,
			where: { name: validationOutcome.name },
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
}
