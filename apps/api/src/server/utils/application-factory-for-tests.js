/**
 * @returns {string}
 */
const generateApplicationReference = () => {
	const number = Math.floor(Math.random() * (1 - 999_999) + 1);

	return `EN01${number}`;
};

/**
 *
 * @param {{id: number, status: string, modifiedAt: Date}} arg
 * @returns {import('@pins/api').Schema.Case}
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
		ApplicationDetails: {
			id,
			caseId: id,
			locationDescription: 'some desc',
			firstNotifiedAt: new Date(),
			submissionAt: new Date(),
			caseEmail: 'test@test.com',
			subSectorId: 1,
			zoomLevelId: 1,
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
