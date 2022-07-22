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
			regions: [
				{
					region: {
						displayNameEn: 'Region Name En',
						displayNameCy: 'Region Name Cy'
					}
				}
			],
			zoomLevel: {
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
			}
		},
		CaseStatus: [
			{
				status
			}
		]
	};
};
