/** @type {Record<string, {name: string, slug: string}>} */
const examinationLibraryCategoryDisplay = {
	APP: {
		name: 'Application documents (APP)',
		slug: 'application-documents'
	},
	AoC: {
		name: 'Adequacy of consultation responses (AoC)',
		slug: 'adequacy-of-consultation-responses'
	},
	PD: {
		name: 'Procedural decisions and notifications (PD)',
		slug: 'procedural-decisions'
	},
	AS: {
		name: 'Additional submissions (AS)',
		slug: 'additional-submissions'
	},
	OD: {
		name: 'Other documents (OD)',
		slug: 'other-documents'
	}
};

/**
 *
 * @param {string|null|undefined} categoryCode
 * @param {string|null|undefined} categoryName
 * @param {number} caseId
 * @returns {{name: string, href: string|null}}
 */
export const getExaminationLibraryCategoryDisplay = (categoryCode, categoryName, caseId) => {
	if (!categoryCode) {
		return {
			name: '',
			href: null
		};
	}

	if (categoryCode === 'NELC') {
		return {
			name: categoryName ?? '',
			href: null
		};
	}

	const category = examinationLibraryCategoryDisplay[categoryCode];

	if (!category) {
		return {
			name: categoryName ?? '',
			href: null
		};
	}

	return {
		name: category.name,
		href: `/applications-service/case/${caseId}/examination-library/${category.slug}`
	};
};
