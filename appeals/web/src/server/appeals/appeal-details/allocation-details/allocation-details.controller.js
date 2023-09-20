import {
	backLink,
	allocationDetailsLevelPage,
	allocationDetailsSpecialismPage,
	allocationDetailsCheckAnswersPage,
	pageHeading
} from './allocation-details.mapper.js';
import logger from '../../../lib/logger.js';
import * as allocationDetailsService from './allocation-details.service.js';
import { objectContainsAllKeys } from '../../../lib/object-utilities.js';

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import("@pins/express/types/express.js").ValidationErrors | string | null} errors
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderAllocationDetailsLevels = async (request, response, errors = null) => {
	const appealDetails = request.currentAppeal;
	const allocationDetailsLevels = await allocationDetailsService.getAllocationDetailsLevels(
		request.apiClient
	);

	if (appealDetails) {
		if (request.session.appealId && request.session.appealId !== appealDetails.appealId) {
			delete request.session.appealId;
			delete request.session.allocationLevel;
			delete request.session.allocationSpecialisms;
		}

		const pageComponents = allocationDetailsLevelPage(
			{ allocationDetailsLevels },
			appealDetails.appealId === request.session.appealId
				? request.session.allocationLevel
				: undefined
		);

		return response.render('patterns/display-page.pattern.njk', {
			backLink: backLink(appealDetails),
			pageHeading,
			appealReference: appealDetails.appealReference,
			pageContents: pageComponents,
			errors
		});
	}
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import("@pins/express/types/express.js").ValidationErrors | string | null} errors
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderAllocationDetailsSpecialism = async (request, response, errors = null) => {
	const appealDetails = request.currentAppeal;

	if (!objectContainsAllKeys(request.session, ['appealId', 'allocationLevel'])) {
		return response.render('app/500.njk');
	}

	const allocationDetailsLevels = await allocationDetailsService.getAllocationDetailsLevels(
		request.apiClient
	);
	const allocationDetailsSpecialisms =
		await allocationDetailsService.getAllocationDetailsSpecialisms(request.apiClient);
	const selectedAllocationLevel = allocationDetailsLevels.find(
		(levelItem) => levelItem.level === request.session.allocationLevel
	);

	if (
		appealDetails &&
		allocationDetailsLevels &&
		allocationDetailsSpecialisms &&
		selectedAllocationLevel
	) {
		const pageComponents = allocationDetailsSpecialismPage(
			{ allocationDetailsLevels, allocationDetailsSpecialisms },
			appealDetails.appealId === request.session.appealId ? selectedAllocationLevel : undefined,
			request.session.allocationSpecialisms
		);

		return response.render('patterns/display-page.pattern.njk', {
			backLink: {
				text: 'Back',
				link: `/appeals-service/appeal-details/${appealDetails.appealId}/allocation-details/allocation-level`
			},
			pageHeading: 'Allocation specialism',
			appealReference: appealDetails.appealReference,
			pageContents: pageComponents,
			errors
		});
	} else {
		return response.render('app/500.njk');
	}
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderAllocationDetailsCheckAnswers = async (request, response) => {
	const appealDetails = request.currentAppeal;

	if (
		!objectContainsAllKeys(request.session, [
			'appealId',
			'allocationLevel',
			'allocationSpecialisms'
		])
	) {
		return response.render('app/500.njk');
	}

	const allocationDetailsLevels = await allocationDetailsService.getAllocationDetailsLevels(
		request.apiClient
	);
	const allocationDetailsSpecialisms =
		await allocationDetailsService.getAllocationDetailsSpecialisms(request.apiClient);
	const selectedAllocationLevel = allocationDetailsLevels.find(
		(levelItem) => levelItem.level === request.session.allocationLevel
	);
	const selectedAllocationSpecialisms = request.session.allocationSpecialisms.map(
		(/** @type {number} */ specialismId) =>
			allocationDetailsSpecialisms.find(
				(currentSpecialism) => currentSpecialism.id === specialismId
			)?.name
	);

	if (
		appealDetails &&
		appealDetails.appealId === request.session.appealId &&
		selectedAllocationLevel &&
		selectedAllocationSpecialisms
	) {
		const pageComponents = allocationDetailsCheckAnswersPage(
			appealDetails.appealId,
			selectedAllocationLevel,
			selectedAllocationSpecialisms
		);

		return response.render('patterns/display-page.pattern.njk', {
			backLink: {
				text: 'Back',
				link: `/appeals-service/appeal-details/${appealDetails.appealId}/allocation-details/allocation-specialism`
			},
			pageHeading: 'Check answers',
			appealReference: appealDetails.appealReference,
			pageContents: pageComponents
		});
	} else {
		return response.render('app/500.njk');
	}
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getAllocationDetailsLevels = async (request, response) => {
	renderAllocationDetailsLevels(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postAllocationDetailsLevels = async (request, response) => {
	const { body, errors } = request;

	if (errors) {
		return renderAllocationDetailsLevels(request, response, errors);
	}

	try {
		const allocationLevel = body['allocation-level'];
		request.session.appealId = request.currentAppeal.appealId;
		request.session.allocationLevel = allocationLevel;
		return response.redirect(
			`/appeals-service/appeal-details/${request.currentAppeal.appealId}/allocation-details/allocation-specialism`
		);
	} catch (error) {
		let errorMessage = 'Something went wrong when adding allocation details levels';
		if (error instanceof Error) {
			errorMessage += `: ${error.message}`;
		}

		logger.error(error, errorMessage);

		return renderAllocationDetailsLevels(request, response, errorMessage);
	}
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getAllocationDetailsSpecialism = async (request, response) => {
	renderAllocationDetailsSpecialism(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postAllocationDetailsSpecialism = async (request, response) => {
	const {
		params: { appealId },
		body,
		errors
	} = request;

	if (errors) {
		return renderAllocationDetailsSpecialism(request, response, errors);
	}

	try {
		let submittedAllocationSpecialism = body['allocation-specialisms'];

		if (!Array.isArray(submittedAllocationSpecialism)) {
			submittedAllocationSpecialism = [submittedAllocationSpecialism];
		}
		const allocationSpecialisms = submittedAllocationSpecialism.map(
			(/** @type {string} */ specialismId) => parseInt(specialismId)
		);
		request.session.allocationSpecialisms = allocationSpecialisms;
		return response.redirect(
			`/appeals-service/appeal-details/${appealId}/allocation-details/check-answers`
		);
	} catch (error) {
		let errorMessage = 'Something went wrong when adding allocation details specialism';
		if (error instanceof Error) {
			errorMessage += `: ${error.message}`;
		}

		logger.error(error, errorMessage);

		return renderAllocationDetailsSpecialism(request, response, errorMessage);
	}
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */

export const getAllocationDetailsCheckAnswers = async (request, response) => {
	renderAllocationDetailsCheckAnswers(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postAllocationDetailsCheckAnswers = async (request, response) => {
	const appealDetails = request.currentAppeal;

	if (!objectContainsAllKeys(request.session, ['allocationLevel', 'allocationSpecialisms'])) {
		return response.render('app/500.njk');
	}

	try {
		const allocationDetails = {
			level: request.session.allocationLevel,
			specialisms: request.session.allocationSpecialisms
		};

		await allocationDetailsService.setAllocationDetails(
			request.apiClient,
			appealDetails.appealId,
			allocationDetails
		);

		delete request.session.allocationLevel;
		delete request.session.allocationSpecialisms;

		request.session.allocationDetailsUpdated = true;

		return response.redirect(`/appeals-service/appeal-details/${appealDetails.appealId}`);
	} catch (error) {
		let errorMessage = 'Something went wrong when setting allocation details';
		if (error instanceof Error) {
			errorMessage += `: ${error.message}`;
		}

		logger.error(error, errorMessage);

		return renderAllocationDetailsSpecialism(request, response, errorMessage);
	}
};
