import { patchRepresentationNoMap } from '../representation.service.js';
import {
	getFormattedErrorSummary,
	getRepresentationPageUrl,
	replaceRepresentaionValuesAsBodyValues
} from '../representation.utilities.js';
import {
	getRepresentationCommentViewModel,
	getDateInputsErrorStatus
} from './representation-comment.view-model.js';
import { receivedDateKeys } from './config.js';

const view = 'applications/representations/representation/representation-comment.njk';

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const getRepresentationComment = async (req, res) => {
	const { query } = req;

	const representationReceivedDate = res.locals.representation.received
		? new Date(res.locals.representation.received)
		: '';

	return res.render(view, {
		...getRepresentationCommentViewModel(query, res.locals),
		receivedDate: representationReceivedDate && {
			day: representationReceivedDate.getUTCDate(),
			month: representationReceivedDate.getUTCMonth() + 1,
			year: representationReceivedDate.getUTCFullYear()
		},
		receivedDateKeys
	});
};

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export const postRepresentationComment = async (req, res) => {
	const { body, errors, params, query } = req;
	const { locals } = res;
	const { caseId } = params;
	const { repId, repType } = query;
	let hasDateErrors = false;

	const payload = {
		originalRepresentation: body.originalRepresentation,
		received: new Date(
			`${body[receivedDateKeys.year]}-${body[receivedDateKeys.month]}-${body[receivedDateKeys.day]}`
		)
	};

	if (errors) {
		/**
		 *
		 * @type {*}
		 */
		let prunedErrors = {};
		const firstDateErrorKey = Object.keys(errors).find((el) => {
			return el.includes(receivedDateKeys.date);
		});

		if (firstDateErrorKey) {
			hasDateErrors = true;
			prunedErrors[firstDateErrorKey] = errors[firstDateErrorKey];
		}

		if ('originalRepresentation' in errors) {
			prunedErrors['originalRepresentation'] = errors['originalRepresentation'];
		}

		return res.render(view, {
			...getRepresentationCommentViewModel(query, locals),
			...replaceRepresentaionValuesAsBodyValues(
				{ ...locals.representation, ...payload },
				{},
				String(repType)
			),
			receivedDate: {
				day: body[receivedDateKeys.day],
				month: body[receivedDateKeys.month],
				year: body[receivedDateKeys.year]
			},
			dateInputsErrorStatus: getDateInputsErrorStatus(errors),
			hasDateErrors,
			errors: prunedErrors,
			errorSummary: getFormattedErrorSummary(prunedErrors),
			receivedDateKeys
		});
	}

	await patchRepresentationNoMap(caseId, String(repId), String(repType), payload);

	return res.redirect(getRepresentationPageUrl('attachments', String(repId), String(repType)));
};
