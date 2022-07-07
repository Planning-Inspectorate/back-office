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
 * @returns {import('@pins/api').Schema.Application[]}
 */
export const applicationFactoryForTests = ({ id, status = 'open', modifiedAt = new Date() }) => {
	return {
		id,
		reference: generateApplicationReference(),
		status,
		title: 'EN010003 - NI Case 3 Name',
		description: 'EN010003 - NI Case 3 Name Description',
		createdAt: new Date(),
		modifiedAt,
		publishedAt: null,
		subSectorId: 1,
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
	};
};
