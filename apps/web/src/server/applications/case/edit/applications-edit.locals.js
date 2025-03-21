import { featureFlagClient } from '../../../../common/feature-flags.js';
import { url } from '../../../lib/nunjucks-filters/index.js';

/**
 * Register the backpath for edit pages.
 *
 * @type {import('express').RequestHandler<*, *, *, *, {caseId: number, backPath: string}>}
 */
export const registerBackPath = (request, response, next) => {
	const { caseId } = response.locals;

	response.locals.backPath = url('case-view', {
		caseId,
		step: featureFlagClient.isFeatureActive('applic-55-welsh-translation')
			? undefined
			: 'project-information'
	});

	next();
};
