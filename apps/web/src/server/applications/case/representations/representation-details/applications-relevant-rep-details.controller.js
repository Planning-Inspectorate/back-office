import { patchRepresentationNoMap } from '../representation/representation.service.js';
import { getFormattedErrorSummary } from '../representation/representation.utilities.js';
import { getRepresentationBaseUrl } from '../representation/utils/get-representation-page-urls.js';
import { getRepresentationDetailsViewModel } from './applications-relevant-rep-details.view-model.js';
import { getCheckAnswerErrors } from './utils/get-check-answer-errors.js';
import { repStatusMap } from './utils/representation-status-map.js';

const view = 'applications/representations/representation-details/index.njk';
const editView = 'applications/representations/representation-details/edit-representation.njk';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getRepresentationDetailsController = async (req, res) => {
	const viewModel = await getRepresentationDetailsViewModel(req.params, req.query, res.locals);
	return res.render(view, viewModel);
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const postRepresentationDetailsController = async (req, res) => {
	const { errors, params, query } = req;
	const { locals } = res;
	const { caseId, representationId } = locals;

	const checkAnswersErrors = errors ? getCheckAnswerErrors(locals, errors) : null;

	if (checkAnswersErrors) {
		return res.render(view, {
			...(await getRepresentationDetailsViewModel(params, query, locals)),
			errors: checkAnswersErrors,
			errorSummary: getFormattedErrorSummary(checkAnswersErrors)
		});
	}

	await patchRepresentationNoMap(caseId, String(representationId), '', {
		status: repStatusMap.awaitingReview
	});

	return res.redirect(getRepresentationBaseUrl(caseId));
};

/**
 * Renders the edit form for Original representation
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getEditRepresentationController = async (req, res) => {
	const { caseId, representationId } = res.locals;
	/** @type {any} */
	const viewModel = await getRepresentationDetailsViewModel(
		{ caseId, representationId },
		req.query,
		res.locals
	);
	return res.render(editView, {
		caseId,
		representationId,
		originalRepresentation: viewModel.representation.originalRepresentation,
		editedRepresentation: viewModel.representation.editedRepresentation || '',
		notes: viewModel.representation.notes || '',
		organisationOrFullname: viewModel.organisationOrFullname,
		projectName: viewModel.projectName,
		statusText: viewModel.statusText,
		redacted: viewModel.representation.redacted,
		errors: null
	});
};

/**
 * Handles saving the edited Original representation
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const postEditRepresentationController = async (req, res) => {
	const { caseId, representationId, representation } = res.locals;
	const { originalRepresentation, notes } = req.body;
	console.log('Edit form submission:', { originalRepresentation, notes });
	let errors = {};
	if (!originalRepresentation || !originalRepresentation.trim()) {
		errors.originalRepresentation = { msg: 'Enter Edited Representation' };
	}
	if (Object.keys(errors).length) {
		/** @type {any} */
		const viewModel = await getRepresentationDetailsViewModel(
			{ caseId, representationId },
			req.query,
			res.locals
		);
		return res.render(editView, {
			caseId,
			representationId,
			originalRepresentation,
			editedRepresentation: viewModel.representation.editedRepresentation,
			notes,
			organisationOrFullname: viewModel.organisationOrFullname,
			projectName: viewModel.projectName,
			statusText: viewModel.statusText,
			redacted: viewModel.representation.redacted,
			errors
		});
	}
	// Save the edited value as editedRepresentation
	const updatedRepresentation = {
		editedRepresentation: originalRepresentation,
		editNotes: notes,
		status: representation.status || 'DRAFT'
	};
	console.log('PATCH update payload:', updatedRepresentation);
	try {
		await patchRepresentationNoMap(
			caseId,
			String(representationId),
			representation.representedType || 'PERSON',
			updatedRepresentation
		);
		return res.redirect(`/applications/${caseId}/representations/${representationId}`);
	} catch (error) {
		/** @type {any} */
		const viewModel = await getRepresentationDetailsViewModel(
			{ caseId, representationId },
			req.query,
			res.locals
		);
		return res.render(editView, {
			caseId,
			representationId,
			originalRepresentation,
			editedRepresentation: viewModel.representation.editedRepresentation,
			notes,
			organisationOrFullname: viewModel.organisationOrFullname,
			projectName: viewModel.projectName,
			statusText: viewModel.statusText,
			redacted: viewModel.representation.redacted,
			errors: { submit: { msg: 'Failed to save changes. Please try again.' } }
		});
	}
};
