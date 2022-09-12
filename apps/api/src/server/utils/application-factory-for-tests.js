/**
 * @returns {string}
 */
const generateApplicationReference = () => {
	const number = Math.floor(Math.random() * (1 - 999_999) + 1);

	return `EN01${number}`;
};

const serviceCustomer = {
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
		postcode: 'Postcode'
	}
};

/**
 *
 * @param {{regions?: boolean, mapZoomLevel?: boolean, subSector?: boolean}} param0
 * @returns {import('@pins/api').Schema.ApplicationDetails}
 */
const getApplicationDetails = ({ regions = true, mapZoomLevel = true, subSector = true }) => {
	return {
		id: 1,
		caseId: 1,
		caseEmail: 'test@test.com',
		submissionAtInternal: new Date(1_658_486_313_000),
		submissionAtPublished: 'Q1 2023',
		locationDescription: 'Some Location',
		...(regions && {
			regions: [
				{
					region: {
						id: 1,
						name: 'region1',
						displayNameEn: 'Region Name 1 En',
						displayNameCy: 'Region Name 1 Cy'
					}
				},
				{
					region: {
						id: 2,
						name: 'region2',
						displayNameEn: 'Region Name 2 En',
						displayNameCy: 'Region Name 2 Cy'
					}
				}
			]
		}),
		zoomLevelId: mapZoomLevel ? 1 : null,
		...(mapZoomLevel && {
			zoomLevel: {
				id: 1,
				displayOrder: 100,
				name: 'zoom-level',
				displayNameEn: 'Zoom Level Name En',
				displayNameCy: 'Zoom Level Name Cy'
			}
		}),
		subSectorId: subSector ? 1 : null,
		...(subSector && {
			subSector: {
				id: 1,
				abbreviation: 'AA',
				name: 'sub_sector',
				displayNameEn: 'Sub Sector Name En',
				displayNameCy: 'Sub Sector Name Cy',
				sectorId: 1,
				sector: {
					id: 1,
					abbreviation: 'BB',
					name: 'sector',
					displayNameEn: 'Sector Name En',
					displayNameCy: 'Sector Name Cy'
				}
			}
		})
	};
};

/**
 *
 * @param {{
 *  id: number,
 *  title: string | null,
 *  description: string | null,
 *  caseStatus: string,
 *  dates?: {createdAt?: Date, modifiedAt?: Date, publishedAt?: Date},
 *  inclusions?: {serviceCustomer?: boolean, ApplicationDetails?: boolean, regions?: boolean, CaseStatus?: boolean, mapZoomLevel?: boolean, subSector?: boolean, gridReference?: boolean}
 * }} arg
 * @returns {import('@pins/api').Schema.Case}
 */
export const applicationFactoryForTests = ({
	id,
	title,
	description,
	caseStatus,
	dates = {},
	inclusions = {}
}) => {
	return {
		id,
		reference: generateApplicationReference(),
		title,
		description,
		createdAt: dates.createdAt || new Date(),
		modifiedAt: dates.modifiedAt || new Date(),
		publishedAt: dates.publishedAt || null,
		CaseStatus: [
			{
				id: 1,
				status: caseStatus
			}
		],
		...(inclusions.gridReference && {
			gridReference: {
				id: 1,
				easting: 123_456,
				northing: 654_321
			}
		}),
		...(inclusions.serviceCustomer && { serviceCustomer: [serviceCustomer] }),
		...(inclusions.ApplicationDetails && {
			ApplicationDetails: getApplicationDetails({
				regions: inclusions.regions,
				mapZoomLevel: inclusions.mapZoomLevel,
				subSector: inclusions.subSector
			})
		})
	};
};
