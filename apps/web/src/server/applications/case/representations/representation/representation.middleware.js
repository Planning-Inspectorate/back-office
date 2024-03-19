import { getRepresentationPageURLs } from './utils/get-representation-page-urls.js';
import { getCase, getRepresentation } from './representation.service.js';
import { getPageLinks } from './utils/get-page-links.js';
import { formatContactDetails } from './representation.utilities.js';

/**
 * @typedef {import('../relevant-representation.types.js').Representation} Representation
 * @typedef {import('../relevant-representation.types.js').Contact} Contact
 */

/**
 *
 * @param {object} case
 * @param {string} case.title
 * @returns {{projectName: string}}
 */
const getCaseViewModel = ({ title }) => ({
	projectName: title
});

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

export const addRepresentationToLocals = async (req, res, next) => {
	try {
		const { params, query, route } = req;
		const { caseId, representationId } = params;
		const { path } = route;
		const { repMode, repId: queryRepId, repType } = query;

		res.locals.caseId = caseId || null;
		res.locals.repId = representationId || queryRepId || null;

		res.locals.case = getCaseViewModel(await getCase(res.locals.caseId));
		res.locals.isRepresented = repType !== 'representative';
		res.locals.prefixBackLink = `/applications-service/case/${caseId}/relevant-representations`;

		const pageURLs = getRepresentationPageURLs(caseId, String(res.locals.repId));

		res.locals.representation = {
			pageLinks: getPageLinks(
				String(repMode),
				path,
				caseId,
				String(res.locals.repId),
				String(repType),
				pageURLs
			),
			pageURLs
		};

		if (res.locals.caseId && res.locals.repId) {
			const representationData = await getRepresentation(
				res.locals.caseId,
				String(res.locals.repId)
			);

			// These were originally initialised as empty objects when undefined, consequentially because of how pick works
			representationData.represented = formatContactDetails(representationData.represented || {});
			representationData.representative = formatContactDetails(
				representationData.representative || {}
			);

			res.locals.representation = {
				...res.locals.representation,
				...representationData
			};
		}

		return next();
	} catch (e) {
		return next(e);
	}
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} response
 * @param {import("express").NextFunction} next
 */
export const addQueryToLocals = async ({ query }, response, next) => {
	const { repId, repType, repMode } = query;

	response.locals.repId = repId || '';
	response.locals.repType = repType || '';
	response.locals.repMode = repMode || '';

	next();
};
