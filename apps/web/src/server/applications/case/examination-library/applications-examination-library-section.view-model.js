import { examinationLibrarySections } from './applications-examination-library-index.view-model.js';

/**
 * Get Examination Library section detail view model
 *
 * @param {{ slug: string }} params
 * @returns {{ sectionHeading: string, selectedPageType: string } | null}
 */
export const getExaminationLibrarySectionViewModel = ({ slug }) => {
	const section = examinationLibrarySections.find((s) => s.slug === slug);

	if (!section) {
		return null;
	}

	return {
		selectedPageType: 'examination-library',
		sectionHeading: section.heading
	};
};
