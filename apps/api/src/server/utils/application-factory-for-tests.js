/**
 * @returns {string}
 */
const generateApplicationReference = () => {
	const number = Math.floor(Math.random() * (1 - 999_999) + 1);

	return `EN01${number}`;
};

/**
 *
 * @param {{id: number, reference: string, status: string, title: string, description: string, createdAt: Date, modifiedAt: Date, publishedAt?: Date}} arg
 * @returns {import('@pins/api').Schema.Case[]}
 */
export const applicationFactoryForTests = ({ id, status = 'open', modifiedAt = new Date() }) => {
	return {
		id,
		reference: generateApplicationReference(),
		title: 'EN010003 - NI Case 3 Name',
		description: 'EN010003 - NI Case 3 Name Description',
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
			firstNotifiedAt: new Date(1_658_486_313_000),
			submissionAt: new Date(1_658_486_313_000),
			locationDescription: 'Some Location',
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
				status
			}
		]
	};
};
