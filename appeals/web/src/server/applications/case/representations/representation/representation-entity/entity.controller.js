import { deleteRepresentationContact, patchRepresentation } from '../representation.service.js';
import { getFormattedErrorSummary, getRepresentationPageUrl } from '../representation.utilities.js';
import { getRepresentationEntityViewModel } from './entity.view-model.js';

const view = 'applications/representations/representation/representation-entity.njk';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getRepresentationEntity = async (req, res) => {
	const { query } = req;
	return res.render(view, {
		...getRepresentationEntityViewModel(query, res.locals)
	});
};

/**
 *  @type {import('@pins/express').RenderHandler<{}, {}, {representationEntity: string}, { repId: string, repType: string }, { caseId: string}>}
 */
export const postRepresentationEntity = async (req, res) => {
	const { body, errors, params, query } = req;
	const { locals } = res;
	const { caseId } = params;
	let { repId, repType } = query;

	if (errors) {
		return res.render(view, {
			pageKey: repType,
			...getRepresentationEntityViewModel(query, locals),
			errors,
			errorSummary: getFormattedErrorSummary(errors)
		});
	}

	let nextPagePath;
	const payload = { type: body.representationEntity };

	if (payload.type === 'AGENT') {
		await patchRepresentation(caseId, repId, 'representative', payload);
		nextPagePath = 'contact-details';
		repType = 'representative';
	} else {
		if (locals.representation?.representative?.id)
			await deleteRepresentationContact(caseId, repId, locals.representation.representative.id);
		nextPagePath = 'add-representation';
		repType = 'represented';
		await patchRepresentation(caseId, repId, repType, payload);
	}

	return res.redirect(getRepresentationPageUrl(nextPagePath, repId, repType));
};
