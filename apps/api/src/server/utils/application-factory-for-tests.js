/**
 * @returns {string}
 */
const generateApplicationReference = () => {
	const number = Math.floor(Math.random() * (1 - 999_999) + 1);

	return `EN01${number}`;
};

/**
 *
 * @param {{
 * 	id?: number,
 * 	status?: string,
 * 	modifiedAt?: Date,
 * 	title?: string | null,
 *  description?: string | null,
 * 	regions?: object[],
 *  subSectorId?: number | null,
 * 	subSector?: import('@pins/api').Schema.SubSector,
 * 	zoomLevelId?: number | null
 * }} arg
 * @returns {import('@pins/api').Schema.Case}
 */
export const applicationFactoryForTests = ({
	id = 1,
	status = 'open',
	modifiedAt = new Date(),
	title = 'EN010003 - NI Case 3 Name',
	description = 'EN010003 - NI Case 3 Name Description',
	subSectorId = 1,
	// subSector = {
	// 	id: 1,
	// 	abbreviation: 'AA',
	// 	name: 'sub_sector',
	// 	displayNameEn: 'Sub Sector Name En',
	// 	displayNameCy: 'Sub Sector Name Cy',
	// 	sectorId: 1,
	// 	sector: {
	// 		id: 1,
	// 		abbreviation: 'BB',
	// 		name: 'sector',
	// 		displayNameEn: 'Sector Name En',
	// 		displayNameCy: 'Sector Name Cy'
	// 	}
	// },
	zoomLevelId = 1
} = {}) => {
	return {
		id,
		reference: generateApplicationReference(),
		title,
		description,
		createdAt: new Date(),
		modifiedAt,
		publishedAt: null,
		serviceCustomer: [
			{
				firstName: 'Service Customer First Name',
				middleName: 'Service Customer Middle Name',
				lastName: 'Service Customer Last Name',
				email: 'service.customer@email.com',
				website: 'Service Customer Website',
				phoneNumber: '01234567890',
				organisationName: 'Organisation',
				address: {
					addressLine1: 'Addr Line 1',
					addressLine2: 'Addr Line 2',
					town: 'Town',
					county: 'County',
					postcode: 'Postcode'
				}
			}
		],
		ApplicationDetails: {
			id,
			caseId: id,
			locationDescription: 'Some Location',
			submissionAtInternal: new Date(),
			submissionAtPublished: '2023 Q1',
			caseEmail: 'test@test.com',
			subSectorId,
			zoomLevelId,
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
			],
			zoomLevel: {
				id: 1,
				displayOrder: 100,
				name: 'zoom-level',
				displayNameEn: 'Zoom Level Name En',
				displayNameCy: 'Zoom Level Name Cy'
			},
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
			},
			gridReference: {
				id: 1,
				easting: 123_456,
				northing: 987_654
			}
		},
		CaseStatus: [
			{
				id: 1,
				status
			}
		]
	};
};
