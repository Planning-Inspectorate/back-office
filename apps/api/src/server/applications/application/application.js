/**
 * NsipProjectPayload
 *
 * The schema definition built up to serve the PINS Data Model and the Applications Front Office.
 *
 * @typedef {object} NsipProjectPayload
 * @property {number} id
 * @property {string?} reference - Application.CaseReference
 * @property {string} title - Application.ProjectName
 * @property {string} description - Application.Summary
 * @property {CaseType} type - "Application"
 * @property {CaseStatus[]} status
 * @property {ApplicationDetails | undefined} application
 * @property {ServiceUser[]} customers - For NSIP Projects, this is the applicant
 * @property {Employee[]} validationOfficers - We're going to get this from ODW
 * @property {Employee[]} caseTeams - We're going to get this from ODW
 * @property {Employee[]} inspectors - We're going to get this from ODW
 * @property {Decision | undefined} decision
 * @property {string} sourceSystem - "ODT"
 */

/**
 * Sector
 *
 * @typedef {object} Sector
 * @property {string?} name
 * @property {string?} abbreviation
 * @property {SubSector?} subSector
 */

/**
 * SubSector
 *
 * @typedef {object} SubSector
 * @property {string?} name
 * @property {string?} abbreviation
 */

/**
 * ApplicationDetails
 *
 * @typedef {object} ApplicationDetails
 * @property {string?} caseEmail - Application.ProjectEmailAddress
 * @property {string?} siteAddress - Application.ProjectLocation
 * @property {Sector | undefined} sector - Application.Proposal
 * @property {GridReference | undefined} gridReference - Application.AnticipatedGridRefNorthing
 * @property {ZoomLevel | undefined} zoom - Application.ProjectLocation
 * @property {Region[]} regions
 * @property {KeyDates | undefined} keyDates
 */

/**
 * GridReference
 *
 * @typedef {object} GridReference
 * @property {number?} easting - Application.AnticipatedGridRefEasting
 * @property {number?} northing
 */

/**
 * ZoomLevel
 *
 * @typedef {object} ZoomLevel - Application.MapZoomLevel
 * @property {string} name
 */

/**
 * KeyDates
 *
 * @typedef {object} KeyDates
 * @property {Date?} receivedDate
 * @property {Date?} validDate
 * @property {Date?} startDate - Application.ConfirmedStartOfExamination
 * @property {Date?} decisionDate - Application.ConfirmedDateOfDecision
 * @property {Date?} closedDate - Application.DateProjectWithdrawn
 * The following are all dates used by Applications but which aren't on PINS Data Model
 * @property {Date?} anticipatedSubmissionDate
 * @property {string?} anticipatedSubmissionDateNonSpecific
 * @property {Date?} dcoSubmissionDate
 * @property {Date?} dcoAcceptanceDate
 * @property {Date?} preliminaryMeetingDate
 * @property {Date?} examEndDate
 * @property {Date?} representationPeriodOpenDate
 * @property {Date?} representationPeriodCloseDate
 * @property {Date?} representationAppearOnWebsiteDate
 * @property {Date?} stage4ExtensiontoExamCloseDate
 * @property {Date?} stage5ExtensionToRecommendationDeadline
 * @property {Date?} stage5ExtensiontoDecisionDeadline
 * @property {Date?} recommendationsDate
 * @property {Date?} nonAcceptanceDate
 */

/**
 * CaseType
 *
 * @typedef {object} CaseType
 * @property {string} code
 */

/**
 * CaseStatus
 *
 * @typedef {object} CaseStatus
 * @property {string} status - Application.Stage
 */

/**
 * Decision
 *
 * @typedef {object} Decision
 * @property {string} code
 * @property {Date} date
 */

/**
 * Employee - we currently don't have this
 *
 * @typedef {object} Employee
 * @property {string} id // eslint-disable-line check-property-names
 * @property {string} firstName
 * @property {string} lastName
 */

/**
 * ServiceUser
 *
 * @typedef {object} ServiceUser
 * @property {number} id
 * @property {string?} customerType - "Applicant"
 * @property {string?} name - Application.PromoterName
 * @property {string?} firstName - Application.PromoterFirstName
 * @property {string?} lastName - Application.PromoterLastName
 * @property {Address?} address
 * @property {string?} phoneNumber - Application.ApplicantPhoneNumber
 * @property {string?} email - Application.ApplicantEmailAddress
 * @property {string?} website - Application.WebAddress
 */

/**
 * Region
 *
 * @typedef {object} Region
 * @property {string} name - Application.Region
 */

/**
 * Address
 *
 * @typedef {object} Address
 * @property {string} addressLine1
 * @property {string?} addressLine2
 * @property {string} town
 * @property {string} county
 * @property {string} postcode
 */

import { pick } from 'lodash-es';

/* @type {CaseType} */
const type = {
	code: 'Application'
};

const sourceSystem = 'ODT';

/**
 * @param {import('@pins/api').Schema.Case} projectEntity
 * @returns {NsipProjectPayload}
 */
export const buildNsipProjectPayload = (projectEntity) => {
	const application = mapApplicationDetails(projectEntity);

	const status =
		projectEntity?.CaseStatus?.map((/** @type {{ status: any; }} */ caseStatus) => ({
			status: caseStatus.status
		})) || [];

	const customers = mapCustomers(projectEntity);

	// 3. Return the result
	// @ts-ignore
	return {
		...pick(projectEntity, ['id', 'reference', 'title', 'description']),
		type,
		sourceSystem,
		inspectors: [],
		validationOfficers: [],
		caseTeams: [],
		status,
		...(application && { application }),
		customers
	};
};

/**
 * @param {import('@pins/api').Schema.Case} projectEntity
 * @returns {ServiceUser[]}
 */
const mapCustomers = (projectEntity) => {
	const serviceCustomers = projectEntity?.serviceCustomer;

	if (!serviceCustomers) {
		return [];
	}

	// @ts-ignore
	return serviceCustomers.map((customer) => {
		return {
			...pick(customer, ['id', 'firstName', 'lastName', 'email', 'website', 'phoneNumber']),
			customerType: 'Applicant',
			...(customer.organisationName && { name: customer.organisationName }),
			...(customer.address && {
				address: pick(customer.address, [
					'addressLine1',
					'addressLine2',
					'town',
					'county',
					'postcode'
				])
			})
		};
	});
};

/**
 * @param {import('@pins/api').Schema.Case} projectEntity
 * @returns {ApplicationDetails | undefined}
 */
const mapApplicationDetails = (projectEntity) => {
	const appDetails = projectEntity?.ApplicationDetails;

	if (!appDetails) {
		return;
	}

	const sector = mapSector(projectEntity);

	const zoom = appDetails.zoomLevel && {
		name: appDetails.zoomLevel.name
	};

	const regions = appDetails.regions?.map((r) => ({ name: r.region.name })) || [];

	const gridReference =
		projectEntity?.gridReference && pick(projectEntity?.gridReference, ['easting', 'northing']);

	return {
		...pick(appDetails, ['caseEmail']),
		siteAddress: appDetails.locationDescription,
		sector,
		zoom,
		regions,
		...(gridReference && { gridReference }),
		// @ts-ignore
		keyDates: {
			anticipatedSubmissionDate: appDetails.submissionAtInternal,
			anticipatedSubmissionDateNonSpecific: appDetails.submissionAtPublished
		}
	};
};

/**
 * @param {import('@pins/api').Schema.Case} projectEntity
 * @returns {Sector | undefined}
 */
const mapSector = (projectEntity) => {
	const subSector = projectEntity?.ApplicationDetails?.subSector;

	if (!subSector?.sector) {
		return;
	}

	return (
		subSector.sector && {
			...pick(subSector.sector, ['abbreviation', 'name']),
			subSector: pick(subSector, ['abbreviation', 'name'])
		}
	);
};
