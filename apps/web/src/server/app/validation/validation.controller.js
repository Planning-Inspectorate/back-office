import { to } from 'planning-inspectorate-libs';
import { validationRoutesConfig as routes } from '../../config/routes.js';
import { checkboxDataToCheckValuesObject } from '../../lib/helpers.js';
import {
	findAllNewIncompleteAppeals,
	findAppealById,
	findAllLocalPlanningDepartments,
	updateAppeal,
	updateAppealDetails,
	uploadDocument
} from './validation.service.js';
import { validationLabelsMap, validationAppealOutcomeLabelsMap } from './validation.config.js';
import { flatten, lowerCase } from 'lodash-es';

/** @typedef {import('@pins/platform').LocalPlanningDepartment} LocalPlanningDepartment */
/** @typedef {import('@pins/validation').Appeal} Appeal */
/** @typedef {import('@pins/validation').AppealDocument} AppealDocument */
/** @typedef {import('@pins/validation').AppealDocumentType} AppealDocumentType */
/** @typedef {import('@pins/validation').AppealOutcomeStatus} AppealOutcomeStatus */

/**
 * GET the main dashboard.
 * It will fetch the appeals list (new, incomplete) and will render all.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 * @returns {void}
 */
export async function getValidationDashboard(request, response, next) {
	let error, appealsListData;
	const newAppeals = [];
	const incompleteAppeals = [];

	// eslint-disable-next-line prefer-const
	[error, appealsListData] = await to(findAllNewIncompleteAppeals());

	if (error) {
		next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));
		return;
	}

	// TODO: data manipulation should be done in templates if required
	// eslint-disable-next-line unicorn/no-array-for-each
	appealsListData.forEach((item) => {
		const row = [
			{ html: `<a href="/validation/${routes.reviewAppealRoute.path}/${item.AppealId}">${item.AppealReference}</a>` },
			{ text: item.Received },
			// eslint-disable-next-line unicorn/no-array-reduce
			{ text: Object.keys(item.AppealSite).reduce((accumulator, key) => {
				if (item.AppealSite[key]) accumulator += (accumulator.length > 0 ? ', ' : '') + item.AppealSite[key];
				return accumulator;
			}, '') }
		];

		if (item.AppealStatus === 'incomplete') {
			incompleteAppeals.push(row);
		} else if (item.AppealStatus === 'new') {
			newAppeals.push(row);
		}
	});

	response.render(routes.home.view, {
		appealsList: {
			newAppeals,
			incompleteAppeals
		}
	});
}

/**
 * @typedef {Object} AppealParams
 * @property {number} appealId - Unique identifier for the appeal.
 */

/**
 * @typedef {Object} ReviewAppealRenderOptions
 * @property {Appeal} appeal - The appeal entity.
 * @property {string} backUrl - The destination path for the page's 'Back' link.
 * @property {boolean} canEditReviewOutcome - A flag to determine whether the
 * outcome options be visible. This applies to 'incomplete' appeals only.
 * @property {AppealOutcomeStatus} reviewOutcome - The outcome value to populate
 * the outcome form.
 */

/**
 * @typedef {Object} ReviewAppealQueryParams
 * @property {'back'=} direction - The direction (if any) by which the user
 * arrived at the page. When navigating via the 'Back' link, this will be
 * populated with 'back'.
 * @property {string=} edit - A UI flag as to whether the review outcome options
 * have been made visible by the user. This applies only to 'incomplete' appeals
 * where displaying the review outcome options first requires an additional
 * 'Change outcome' action to be performed in the UI.
 */

/**
 * Load the review appeal page used for recording an outcome on a new or
 * incomplete appeal. As a side effect of loading this page, we initialize the
 * session with the appeal as this page is the first step in any review journey.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams, ReviewAppealRenderOptions, ReviewAppealQueryParams>}
 */
export async function getReviewAppeal({ query, session, params }, response) {
	if (session.appealWork && `${session.appealData?.AppealId}` !== params.appealId) {
		session.appealWork = {};
	}
	const appeal = await findAppealById(params.appealId);

	// Save the current appeal data into session storage
	session.appealData = appeal;

	response.render(routes.reviewAppealRoute.view, {
		backURL: `/${routes.home.path}?direction=back`,
		appeal,
		canEditReviewOutcome: Boolean(query.edit || query.direction),
		reviewOutcome: session.appealWork?.reviewOutcome
	});
}

/**
 * @typedef {Object} AppealOutcomeBody
 * @property {AppealOutcomeStatus} reviewOutcome - the outcome chosen by the user reviewing the appeal
 */

/** @typedef {ReviewAppealRenderOptions & import('@pins/express').ErrorRenderOptions} AppealOutcomeRenderOptions */

/**
 * Record the outcome for a new or incomplete appeal.
 *
 * @type {import('@pins/express').CommandHandler<{}, AppealOutcomeRenderOptions, AppealOutcomeBody>}
 */
export function postAppealOutcome({ body, session, validationErrors }, response) {
	if (validationErrors) {
		return response.render(routes.reviewAppealRoute.view, {
			appeal: session.appealData,
			backURL: `/${routes.home.path}?direction=back`,
			canEditReviewOutcome: true,
			errors: validationErrors
		});
	}

	(session.appealWork ??= {}).reviewOutcome = body.reviewOutcome;

	/** @type {string} **/ let nextStepPath;

	switch (body.reviewOutcome) {
		case 'valid':
			nextStepPath = routes.validAppealOutcome.path;
			break;
		case 'invalid':
			nextStepPath = routes.invalidAppealOutcome.path;
			break;
		case 'incomplete':
			nextStepPath = routes.incompleteAppealOutcome.path;
			break;
		default:
			throw new Error(`Could not determine next step for review outcome '${body.reviewOutcome}'`);
	}

	return response.redirect(`/validation/${nextStepPath}`);
}

/**
 * @typedef {Object} EditAppellantNameRenderOptions
 * @property {number} appealId - Unique identifier for the appeal.
 * @property {string} appellantName - The appellant name used to populate the
 * edit form.
 */

/**
 * Load a page allowing the user to edit the appellant name for an appeal.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams, EditAppellantNameRenderOptions>}
 */
export async function editAppellantName({ params }, response) {
	const appeal = await findAppealById(params.appealId);

	response.render('validation/edit-appellant-name', {
		appealId: params.appealId,
		appellantName: appeal.AppellantName
	});
}

/**
 * @typedef {Object} UpdateAppellantNameBody
 * @property {string} appellantName - The appellant name to save to the appeal.
 */

/** @typedef {EditAppellantNameRenderOptions & import('@pins/express').ErrorRenderOptions} UpdateAppellantNameRenderOptions */

/**
 * Update the appellant name belonging to a given `appealId`.
 *
 * @type {import('@pins/express').CommandHandler<AppealParams, UpdateAppellantNameRenderOptions, UpdateAppellantNameBody>}
 */
export async function updateAppellantName({ body, params, validationErrors }, response) {
	if (validationErrors) {
		response.render('validation/edit-appellant-name', {
			appellantName: body.appellantName,
			errors: validationErrors
		});
		return;
	}
	await updateAppealDetails(params.appealId, body);

	response.redirect(`/validation/review-appeal/${params.appealId}`);
}

/**
 * @typedef {Object} EditAppealSiteRenderOptions
 * @property {number} appealId - Unique identifier for the appeal.
 * @property {Appeal['AppealSite']} appealSite - The appeal site used to populate the
 * edit form.
 */

/**
 * Load a page allowing the user to edit the appeal site belonging to an appeal.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams, EditAppealSiteRenderOptions>}
 */
export async function editAppealSite({ params }, response) {
	const appeal = await findAppealById(params.appealId);

	response.render('validation/edit-appeal-site', {
		appealId: appeal.AppealId,
		appealSite: appeal.AppealSite
	});
}

/** @typedef {Appeal['AppealSite']} UpdateAppealSiteBody */
/** @typedef {EditAppealSiteRenderOptions & import('@pins/express').ErrorRenderOptions} UpdateAppealSiteRenderOptions */

/**
 * Update the appeal site belonging to a given `appealId`.
 *
 * @type {import('@pins/express').CommandHandler<AppealParams, UpdateAppealSiteRenderOptions, UpdateAppealSiteBody>}
 */
export async function updateAppealSite({ body, params, validationErrors }, response) {
	if (validationErrors) {
		response.render('validation/edit-appeal-site', {
			appealId: params.appealId,
			appealSite: body,
			errors: validationErrors
		});
		return;
	}

	await updateAppealDetails(params.appealId, { Address: body });

	response.redirect(`/validation/review-appeal/${params.appealId}`);
}

/**
 * @typedef {Object} EditLocalPlanningDeptRenderOptions
 * @property {number} appealId - Unique identifier for the appeal.
 * @property {string} localPlanningDepartment - The local planning department
 * with which to populate the edit form.
 * @property {LocalPlanningDepartment[]} source - A collection of local planning
 * department entities from which the user will choose the local planning
 * department.
 */

/**
 * Load a page allowing the user to edit the local planning department belonging
 * to an appeal.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams, EditLocalPlanningDeptRenderOptions>}
 */
export async function editLocalPlanningDepartment({ params }, response) {
	const [appeal, source] = await Promise.all([findAppealById(params.appealId), findAllLocalPlanningDepartments()]);

	response.render('validation/edit-local-planning-department', {
		appealId: appeal.AppealId,
		localPlanningDepartment: appeal.LocalPlanningDepartment,
		source
	});
}

/**
 * @typedef {Object} UpdateLocalPlanningDeptBody
 * @property {string} LocalPlanningDepartment - The local planning department
 * to save to the appeal.
 */

/** @typedef {EditLocalPlanningDeptRenderOptions & import('@pins/express').ErrorRenderOptions} UpdateLocalPlanningDepartmentRenderOptions */

/**
 * Update the local planning department belonging to a given `appealId`.
 *
 * @type {import('@pins/express').CommandHandler<AppealParams, UpdateLocalPlanningDepartmentRenderOptions, UpdateLocalPlanningDeptBody>}
 */
export async function updateLocalPlanningDepartment({ body, params, validationErrors }, response) {
	if (validationErrors) {
		const source = await findAllLocalPlanningDepartments();

		response.render('validation/edit-local-planning-department', {
			appealId: params.appealId,
			localPlanningDepartment: body.LocalPlanningDepartment,
			source,
			errors: validationErrors
		});
		return;
	}

	await updateAppealDetails(params.appealId, body);

	response.redirect(`/validation/review-appeal/${params.appealId}`);
}

/**
 * @typedef {Object} EditPlanningApplicationRefRenderOptions
 * @property {number} appealId - Unique identifier for the appeal.
 * @property {string} planningApplicationReference - The planning application
 * reference with which to populate the edit form.
 */

/**
 * Load a page allowing the user to edit the planning application reference belonging
 * to a given `appealId`.
 *
 * @type {import('@pins/express').QueryHandler<AppealParams, EditPlanningApplicationRefRenderOptions>}
 */
export async function editPlanningApplicationReference({ params }, response) {
	const appeal = await findAppealById(params.appealId);

	response.render('validation/edit-planning-application-reference', {
		appealId: appeal.AppealId,
		planningApplicationReference: appeal.PlanningApplicationReference
	});
}

/**
 * @typedef {Object} UpdatePlanningApplicationRefBody
 * @property {string} planningApplicationReference - The planning application
 * reference to save to the appeal.
 */

/** @typedef {EditPlanningApplicationRefRenderOptions & import('@pins/express').ErrorRenderOptions} UpdatePlanningApplicationRefRenderOptions */

/**
 * Update the planning application reference belonging to a given `appealId`.
 *
 * @type {import('@pins/express').CommandHandler<AppealParams, UpdatePlanningApplicationRefRenderOptions, UpdatePlanningApplicationRefBody>}
 */
export async function updatePlanningApplicationReference({ body, params, validationErrors }, response) {
	if (validationErrors) {
		response.render('validation/edit-planning-application-reference', {
			appealId: params.appealId,
			planningApplicationReference: body.planningApplicationReference,
			errors: validationErrors
		});
		return;
	}

	await updateAppealDetails(params.appealId, body);

	response.redirect(`/validation/review-appeal/${params.appealId}`);
}

/**
 * @typedef {Object} EditDocumentsParams
 * @property {number} appealId - Unique identifier for the appeal.
 * @property {string} documentType - A dash-cased representation of the document
 * type, (used for compatibility with a url).
 */

/**
 * @typedef {Object} EditDocumentsRenderOptions
 * @property {number} appealId - Unique identifier for the appeal.
 * @property {AppealDocument[]} documents - All documents belonging to the appeal.
 * @property {AppealDocumentType} documentType - The type of document to display in the page.
 */

/**
 * Load a page allowing the user to upload documents to an appeal.
 *
 * @type {import('@pins/express').QueryHandler<EditDocumentsParams, EditDocumentsRenderOptions>}
 */
export async function editDocuments({ params }, response) {
	const appeal = await findAppealById(params.appealId);

	response.render('validation/edit-documents', {
		appealId: params.appealId,
		documentType: lowerCase(params.documentType),
		documents: appeal.Documents
	});
}

/** @typedef {EditDocumentsRenderOptions & import('@pins/express').ErrorRenderOptions} UpdateDocumentsRenderOptions */

/**
 * Upload additional documents to an appeal, according to a given `appealId` and `documentType`.
 *
 * @type {import('@pins/express').CommandHandler<EditDocumentsParams, UpdateDocumentsRenderOptions>}
 */
export async function uploadDocuments({ files, params, validationErrors }, response) {
	const documentType = lowerCase(params.documentType);

	if (validationErrors) {
		const appeal = await findAppealById(params.appealId);

		response.render('validation/edit-documents', {
			appealId: params.appealId,
			documentType,
			documents: appeal.Documents,
			errors: validationErrors
		});
		return;
	}

	/** @type {Express.Multer.File[]} **/ const fileArray = files;

	await Promise.all(fileArray.map((file) => uploadDocument(params.appealId, { documentType, file })));

	response.redirect(`/validation/review-appeal/${params.appealId}`);
}

/**
 * GET the valid appeal outcome next page journey.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @returns {void}
 */
export function getValidAppealOutcome(request, response) {
	const backURL = `/validation/${routes.reviewAppealRoute.path}/${request.session.appealData?.AppealId}?direction=back`;
	const appealData = request.session.appealData;
	const { descriptionOfDevelopment } = request.session.appealWork;

	response.render(routes.validAppealOutcome.view, {
		backURL,
		changeOutcomeURL: backURL,
		appealData,
		descriptionOfDevelopment
	});
}

/**
 * POST the valid appeal details page
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @returns {void}
 */
export function postValidAppealDetails(request, response) {
	const backURL = `/validation/${routes.reviewAppealRoute.path}/${request.session.appealData?.AppealId}?direction=back`;
	const descriptionOfDevelopment = request.body['valid-appeal-details'];
	const appealData = request.session.appealData;

	// TODO: Should I just pass the appealWork obj?
	(request.session.appealWork ??= {}).descriptionOfDevelopment = descriptionOfDevelopment;

	// Clear any session data from other validation journeys to prevent errors
	delete request.session.appealWork.invalidAppealDetails;
	delete request.session.appealWork.incompleteAppealDetails;

	const {
		body: { errors = {}, errorSummary = [] }
	} = request;

	if (Object.keys(errors).length > 0) {
		return response.render(routes.validAppealOutcome.view, {
			backURL,
			changeOutcomeURL: backURL,
			errors,
			errorSummary,
			appealData,
			descriptionOfDevelopment
		});
	}

	return response.redirect(`/validation/${routes.checkAndConfirm.path}`);
}

/**
 * GET the invalid appeal outcome next page journey.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @returns {void}
 */
export function getInvalidAppealOutcome(request, response) {
	const backURL = `/validation/${routes.reviewAppealRoute.path}/${request.session.appealData?.AppealId}?direction=back`;
	const appealData = request.session.appealData;

	const { invalidReasons = [], otherReasons = '' } = request.session.appealWork?.invalidAppealDetails
		? request.session.appealWork.invalidAppealDetails
		: {};

	return response.render(routes.invalidAppealOutcome.view, {
		backURL,
		changeOutcomeURL: backURL,
		appealData,
		invalidReasons: checkboxDataToCheckValuesObject(invalidReasons),
		otherReasons
	});
}

/**
 * POST the invalid appeal outcome page.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @returns {void}
 */
export function postInvalidAppealOutcome(request, response) {
	const backURL = `/validation/${routes.reviewAppealRoute.path}/${request.session.appealData?.AppealId}?direction=back`;
	const appealData = request.session.appealData;

	const {
		body: { errors = {}, errorSummary = [], invalidReasons = [], otherReasons = '' }
	} = request;

	if (Object.keys(errors).length > 0) {
		return response.render(routes.invalidAppealOutcome.view, {
			backURL,
			changeOutcomeURL: backURL,
			errors,
			errorSummary,
			appealData,
			invalidReasons: checkboxDataToCheckValuesObject(invalidReasons),
			otherReasons
		});
	}

	(request.session.appealWork ??= {}).invalidAppealDetails = {
		invalidReasons,
		otherReasons
	};

	// Clear any session data from other validation journeys to prevent errors
	delete request.session.appealWork.descriptionOfDevelopment;
	delete request.session.appealWork.incompleteAppealDetails;

	return response.redirect(`/validation/${routes.checkAndConfirm.path}`);
}

/**
 * GET the incomplete appeal outcome next page journey.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @returns {void}
 */
export function getIncompleteAppealOutcome(request, response) {
	const backURL = `/validation/${routes.reviewAppealRoute.path}/${request.session.appealData?.AppealId}?direction=back`;
	const appealData = request.session.appealData;

	const {
		incompleteReasons = [],
		missingOrWrongDocsReasons = [],
		otherReasons = ''
	} = request.session.appealWork?.incompleteAppealDetails ? request.session.appealWork.incompleteAppealDetails : {};

	return response.render(routes.incompleteAppealOutcome.view, {
		backURL,
		changeOutcomeURL: backURL,
		appealData,
		incompleteReasons: checkboxDataToCheckValuesObject(incompleteReasons),
		otherReasons,
		missingOrWrongDocsReasons: incompleteReasons.includes('missingOrWrongDocs') ? checkboxDataToCheckValuesObject(missingOrWrongDocsReasons) : undefined
	});
}

/**
 * POST the incomplete appeal outcome page
 * If there are errors, it will reload the incomplete appeal outcome page and display the errors
 * If there are no errors, it will render the check and confirm page
 *
 * @param {object} request - Express request object
 * @param {object} response - Express request object
 * @returns {void}
 */
export function postIncompleteAppealOutcome(request, response) {
	const backURL = `/validation/${routes.reviewAppealRoute.path}/${request.session.appealData?.AppealId}?direction=back`;
	const appealData = request.session.appealData;

	const {
		body: { errors = {}, errorSummary = [], incompleteReasons = [], otherReasons = '', missingOrWrongDocsReasons = [] }
	} = request;

	if (Object.keys(errors).length > 0) {
		return response.render(routes.incompleteAppealOutcome.view, {
			backURL,
			changeOutcomeURL: backURL,
			errors,
			errorSummary,
			appealData,
			incompleteReasons: checkboxDataToCheckValuesObject(incompleteReasons),
			otherReasons,
			missingOrWrongDocsReasons: incompleteReasons.includes('missingOrWrongDocs')
				? checkboxDataToCheckValuesObject(missingOrWrongDocsReasons)
				: undefined
		});
	}

	(request.session.appealWork ??= {}).incompleteAppealDetails = {
		incompleteReasons,
		otherReasons,
		missingOrWrongDocsReasons
	};

	// Clear any session data from other validation journeys to prevent errors
	delete request.session.appealWork.descriptionOfDevelopment;
	delete request.session.appealWork.invalidAppealDetails;

	return response.redirect(routes.checkAndConfirm.path);
}

/**
 * GET the check and confirm page used by all appeal outcomes journeys.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @returns {void}
 */
export function getCheckAndConfirm(request, response) {
	const { appealData, appealWork } = request.session;

	// Determine the back url depending on where the user originated from in the
	// validation journey
	let backURL;

	if ('invalidAppealDetails' in appealWork) {
		backURL = `/validation/${routes.invalidAppealOutcome.path}?direction=back`;
	} else if ('incompleteAppealDetails' in appealWork) {
		backURL = `/validation/${routes.incompleteAppealOutcome.path}?direction=back`;
	} else {
		backURL = `/validation/${routes.validAppealOutcome.path}?direction=back`;
	}

	const changeOutcomeURL = `/validation/${routes.reviewAppealRoute.path}/${appealData.AppealId}?direction=back`;

	let invalidReasons;
	if (appealWork.invalidAppealDetails && appealWork.invalidAppealDetails.invalidReasons) {
		invalidReasons = flatten([appealWork.invalidAppealDetails.invalidReasons]);
		request.session.appealWork.invalidAppealDetails.invalidReasons = invalidReasons;
	}

	let incompleteReasons;
	if (appealWork.incompleteAppealDetails && appealWork.incompleteAppealDetails.incompleteReasons) {
		incompleteReasons = flatten([appealWork.incompleteAppealDetails.incompleteReasons]);
		request.session.appealWork.incompleteAppealDetails.incompleteReasons = incompleteReasons;
	}

	// eslint-disable-next-line unicorn/prevent-abbreviations
	let missingOrWrongDocsReasons;
	if (appealWork.incompleteAppealDetails && appealWork.incompleteAppealDetails.missingOrWrongDocsReasons) {
		missingOrWrongDocsReasons = flatten([appealWork.incompleteAppealDetails.missingOrWrongDocsReasons]);
		request.session.appealWork.incompleteAppealDetails.missingOrWrongDocsReasons = missingOrWrongDocsReasons;
	}

	response.render(routes.checkAndConfirm.view, {
		backURL,
		changeOutcomeURL,
		appealData,
		appealWork,
		invalidReasons,
		incompleteReasons,
		missingOrWrongDocsReasons,
		validationLabelsMap,
		validationAppealOutcomeLabels: validationAppealOutcomeLabelsMap[appealWork.reviewOutcome]
	});
}

/**
 * Utility function to create Reason data in valid format for updateAppeal API post using the supplied details data
 *
 * @param {string} outcomeType - string specifying the applicable outcome ('invalid' or 'incomplete') (valid outcome returns an empty object as Reasons not required for that case)
 * @param {object} appealDetails - details object from session storage containing data on the outcome
 * @returns {object} - resulting Reasons object in valid format (see /api-docs/#/default/post_validation__id_ for details)
 */
function formatOutcomeReasonsDataForApiPost(outcomeType, appealDetails) {
	let data = {};

	switch (outcomeType) {
		case 'invalid':
			data = {
				// eslint-disable-next-line unicorn/no-array-reduce, unicorn/prefer-object-from-entries
				...appealDetails.invalidReasons.reduce((accumulator, value) => {
					if (value === 'otherReason') return accumulator;

					accumulator[value] = true;
					return accumulator;
				}, {})
			};

			if (appealDetails.otherReasons) data.otherReasons = appealDetails.otherReasons;

			break;
		case 'incomplete':
			data = {
				// eslint-disable-next-line unicorn/no-array-reduce, unicorn/prefer-object-from-entries
				...appealDetails.incompleteReasons.reduce((accumulator, value) => {
					if (value === 'missingOrWrongDocs') return accumulator;
					if (value === 'otherReason') return accumulator;

					accumulator[value] = true;
					return accumulator;
				}, {})
			};

			if (appealDetails.otherReasons) data.otherReasons = appealDetails.otherReasons;

			// eslint-disable-next-line unicorn/no-array-for-each
			appealDetails.missingOrWrongDocsReasons.forEach((reason) => {
				// eslint-disable-next-line unicorn/prefer-string-slice
				data[`missing${reason[0].toUpperCase()}${reason.substring(1)}`] = true;
			});

			break;
		default:
			break;
	}

	return data;
}

/**
 * POST the check and confirm page used by all appeal outcomes journeys.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @param {Function} next  - Express function that calls then next middleware in the stack
 * @returns {void}
 */
export async function postCheckAndConfirm(request, response, next) {
	const backURL = `/validation/${routes.reviewAppealRoute.path}/${request.session.appealData?.AppealId}?direction=back`;
	const appealData = request.session.appealData;
	const appealWork = request.session.appealWork;

	const {
		body: { errors = {}, errorSummary = [] }
	} = request;

	let incompleteReasons;
	if (appealWork.incompleteAppealDetails && appealWork.incompleteAppealDetails.incompleteReasons) {
		incompleteReasons = flatten([appealWork.incompleteAppealDetails.incompleteReasons]);
	}

	let missingOrWrongDocsReasons;
	if (appealWork.incompleteAppealDetails && appealWork.incompleteAppealDetails.missingOrWrongDocsReasons) {
		missingOrWrongDocsReasons = flatten([appealWork.incompleteAppealDetails.missingOrWrongDocsReasons]);
	}

	if (Object.keys(errors).length > 0) {
		return response.render(routes.checkAndConfirm.view, {
			backURL,
			changeOutcomeURL: backURL,
			errors,
			errorSummary,
			appealData,
			appealWork,
			incompleteReasons,
			missingOrWrongDocsReasons,
			validationLabelsMap,
			validationAppealOutcomeLabels: validationAppealOutcomeLabelsMap[appealWork.reviewOutcome]
		});
	}

	// Update the appeal status and transition it to the next phase.
	// Convert the form / appeal session data into a valid payload format.
	const appealUpdateData = {
		AppealStatus: appealWork.reviewOutcome,
		Reason: formatOutcomeReasonsDataForApiPost(
			appealWork.reviewOutcome, appealWork.reviewOutcome === 'invalid' ? appealWork.invalidAppealDetails : appealWork.incompleteAppealDetails
		)
	};

	if (appealWork.reviewOutcome === 'valid') {
		appealUpdateData.descriptionOfDevelopment = appealWork.descriptionOfDevelopment || '';
	}

	// Update the appeal with the outcome of the validation.
	const [error, updateStatus] = await to(updateAppeal(appealData.AppealId, appealUpdateData));

	if (error) {
		next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));

		return error;
	}

	response.redirect(routes.reviewAppealComplete.path);
}

/**
 * GET the review appeal complete page that shows the status and a link to go back to the dashboard.
 *
 * @param {import('express').Request} request - Express request object
 * @param {import('express').Response} response - Express request object
 * @returns {void}
 */
export function getReviewAppealComplete(request, response) {
	const appealData = request.session.appealData;
	const appealWork = request.session.appealWork;

	// Destroy the current session as the appeal has been validated.
	request.session.destroy();

	response.render(routes.reviewAppealComplete.view, {
		appealData,
		appealWork,
		validationAppealOutcomeLabels: validationAppealOutcomeLabelsMap[appealWork.reviewOutcome]
	});
}
