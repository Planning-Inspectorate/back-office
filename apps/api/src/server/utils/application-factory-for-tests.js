/**
 *
 * @returns {string}
 */
const generateApplicationReference = () => {
	const number = Math.floor(Math.random() * (1 - 999_999) + 1);

	return `APP/Q9999/D/21/${number}`;
};

/**
 *
 * @param {{id: number, status: string, modifiedAt: Date}} arg
 * @returns {import('@pins/api').Schema.Application}
 */
export const applicationFactoryForTests = ({ id, status = 'open', modifiedAt = new Date() }) => {
	return {
		id,
		reference: generateApplicationReference(),
		status,
		modifiedAt,
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
