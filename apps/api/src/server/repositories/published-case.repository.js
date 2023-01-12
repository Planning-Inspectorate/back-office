const data = {
	id: 23,
	reference: 'BC010001',
	title: 'Office Use Test Application 1',
	description: 'A description of test case 1 which is a case of subsector type Office Use',
	status: 'Withdrawn',
	caseEmail: 'caseemail@gmail.com',

	sector: {},

	subSector: {
		name: 'office_use',
		abbreviation: 'BC01',
		displayNameEn: 'Office Use',
		displayNameCy: 'Office Use'
	},

	applicants: [
		{
			organisationName: '',
			firstName: '',
			middleName: '',
			lastName: '',
			email: '',
			address: {
				addressLine1: '',
				addressLine2: '',
				town: '',
				county: '',
				postcode: ''
			},
			website: '',
			phoneNumber: ''
		}
	],

	geographicalInformation: {
		mapZoomLevel: {
			id: 5,
			name: 'district',
			displayNameEn: 'District',
			displayNameCy: 'District'
		}
	},

	locationDescription: 'location description',

	gridReference: {},

	regions: [{}],

	keyDates: {
		submissionDatePublished: 'Q1 2023',
		submissionDateInternal: 123
	}
};

/**
 * @typedef {{
 *  caseDetails?: { title?: string | null, description?: string | null },
 * 	gridReference?: { easting?: number | null, northing?: number | null },
 *  applicationDetails?: { locationDescription?: string | null, submissionAtInternal?: Date | null, submissionAtPublished?: string | null, caseEmail?: string | null },
 *  subSectorName?: string | null,
 *  applicant?: { organisationName?: string | null, firstName?: string | null, middleName?: string | null, lastName?: string | null, email?: string | null, website?: string | null, phoneNumber?: string | null},
 *  mapZoomLevelName?: string | null,
 *  regionNames?: string[],
 *  applicantAddress?: { addressLine1?: string | null, addressLine2?: string | null, town?: string | null, county?: string | null, postcode?: string | null}}} CreateApplicationParams
 */

/**
 * @typedef {{
 *  caseId: number,
 *  applicantId?: number,
 *  caseDetails?: { title?: string | null, description?: string | null },
 * 	gridReference?: { easting?: number | null, northing?: number | null },
 *  applicationDetails?: { locationDescription?: string | null, submissionAtInternal?: Date | null, submissionAtPublished?: string | null, caseEmail?: string | null },
 *  subSectorName?: string | null,
 *  applicant?: { organisationName?: string | null, firstName?: string | null, middleName?: string | null, lastName?: string | null, email?: string | null, website?: string | null, phoneNumber?: string | null},
 *  mapZoomLevelName?: string | null,
 *  regionNames?: string[],
 *  applicantAddress?: { addressLine1?: string | null, addressLine2?: string | null, town?: string | null, county?: string | null, postcode?: string | null}}} UpdateApplicationParams
 */

/**
 * @param {any} caseInfo
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.publishedCase>}
 */
export const createApplication = (caseInfo) => {
	return Promise.resolve(caseInfo);
};

/**
 *
 * @param {number} id
 * @returns {import('@prisma/client').PrismaPromise<import('@pins/api').Schema.publishedCase | null>}
 */
export const getById = (id) => {
	return Promise.resolve({ ...data, id });
};
