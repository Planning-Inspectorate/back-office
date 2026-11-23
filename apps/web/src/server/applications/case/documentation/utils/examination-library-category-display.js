import { url } from '../../../../lib/nunjucks-filters/url.js';

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
 * Get the dynamic section slug based on the category code.
 *
 * @param {string} categoryCode
 * @returns {string|null}
 */
const getDynamicSectionSlug = (categoryCode) => {
	if (/^EV\d+$/.test(categoryCode)) return 'events-and-hearings';
	if (/^PD[A-Z]+$/.test(categoryCode)) return 'procedural-deadlines';
	if (/^REP\d+[a-z]?$/.test(categoryCode)) return 'deadlines';

	return null;
};

/**
 *
 * @param {string} categoryName
 * @return {string}
 */
const getCategorySlug = (categoryName) => categoryName.toLowerCase().trim().replace(/\s+/g, '-');

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

	const dynamicSectionSlug = getDynamicSectionSlug(categoryCode);

	if (dynamicSectionSlug && categoryName) {
		const categorySlug = getCategorySlug(categoryName);

		return {
			name: `${categoryName} (${categoryCode})`,
			href: url('examination-library-section', {
				caseId,
				slug: `${dynamicSectionSlug}/${categorySlug}`
			})
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
		href: url('examination-library-section', { caseId, slug: category.slug })
	};
};
