import { getCase, getRepresentation } from './representation.service.js';
import { formatContactDetails } from './representation.utilities.js';

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

const getContactDetailsByContactType = ({ contacts }) => ({
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
		const { params, query } = req;
		const { caseId } = params;

		const { repId, repType } = query;

		res.locals.case = getCaseViewModel(await getCase(caseId));
		res.locals.isRepresented = repType !== 'representative';
		res.locals.prefixBackLink = `/applications-service/case/${caseId}/relevant-representations`;

		if (repId) {
			const representationData = await getRepresentation(caseId, String(repId));
			const { represented, representative } = getContactDetailsByContactType(representationData);

			delete representationData.contacts;
			res.locals.representation = {
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
