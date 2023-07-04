import { getRepresentationPageURLs } from './utils/get-representation-page-urls.js';
import { getCase, getRepresentation } from './representation.service.js';
import { formatContactDetails } from './representation.utilities.js';
import { getPageLinks } from './utils/get-page-links.js';

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
 *
 * @param {object} representation
 * @param {Array<any>} representation.contacts
 * @returns {{represented: object, representative: object}}
 */

export const getContactDetailsByContactType = ({ contacts }) => ({
	represented: formatContactDetails(contacts.find((element) => element.type !== 'AGENT')),
	representative: formatContactDetails(contacts.find((element) => element.type === 'AGENT'))
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
		const repId = representationId || queryRepId;

		res.locals.case = getCaseViewModel(await getCase(caseId));
		res.locals.isRepresented = repType !== 'representative';
		res.locals.prefixBackLink = `/applications-service/case/${caseId}/relevant-representations`;

		const pageURLs = getRepresentationPageURLs(caseId, String(repId));

		res.locals.representation = {
			pageLinks: getPageLinks(
				String(repMode),
				path,
				caseId,
				String(repId),
				String(repType),
				pageURLs
			),
			pageURLs
		};

		if (repId) {
			const representationData = await getRepresentation(caseId, String(repId));
			const { represented, representative } = getContactDetailsByContactType(representationData);
			delete representationData.contacts;

			res.locals.representation = {
				...res.locals.representation,
				...representationData,
				represented,
				representative
			};
		}

		return next();
	} catch (e) {
		return next(e);
	}
};
