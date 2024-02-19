import logger from '#lib/logger.js';
import {
	postUnlinkRequest,
	linkAppealToBackOfficeAppeal,
	linkAppealToLegacyAppeal
} from './linked-appeals.service.js';
import {
	linkedAppealsPage,
	addLinkedAppealPage,
	addLinkedAppealCheckAndConfirmPage,
	unlinkAppealPage
} from './linked-appeals.mapper.js';
import { getAppealDetailsFromId } from '../appeal-details.service.js';
import { addNotificationBannerToSession } from '#lib/session-utilities.js';
import { objectContainsAllKeys } from '#lib/object-utilities.js';

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getLinkedAppeals = async (request, response) => {
	return renderLinkedAppeals(request, response);
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderLinkedAppeals = async (request, response) => {
	const { errors } = request;

	const appealId = request.params.appealId;
	const parentId =
		request.query.parentId && request.query.parentId !== 'null'
			? String(request.query.parentId)
			: '';
	const childShortAppealReference = request.query.childShortAppealReference
		? String(request.query.childShortAppealReference)
		: '';

	const appealData = await getAppealDetailsFromId(request.apiClient, parentId || appealId);

	const mappedPageContent = linkedAppealsPage(
		appealData,
		childShortAppealReference,
		appealId,
		parentId
	);

	return response.render('patterns/display-page.pattern.njk', {
		pageContent: mappedPageContent,
		errors
	});
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getAddLinkedAppealReference = async (request, response) => {
	return renderAddLinkedAppealReference(request, response);
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const renderAddLinkedAppealReference = async (request, response) => {
	const {
		errors,
		params: { appealId }
	} = request;

	const appealDetails = await getAppealDetailsFromId(request.apiClient, appealId);

	const mappedPageContent = await addLinkedAppealPage(appealDetails);

	return response.render('patterns/change-page.pattern.njk', {
		pageContent: mappedPageContent,
		errors
	});
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const postAddLinkedAppeal = async (request, response) => {
	if (request.errors) {
		return renderAddLinkedAppealReference(request, response);
	}

	return response.redirect('/appeals-service/appeal-details/4428/linked-appeals/add/check-and-confirm');
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getAddLinkedAppealCheckAndConfirm = async (request, response) => {
	return renderAddLinkedAppealCheckAndConfirm(request, response);
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const renderAddLinkedAppealCheckAndConfirm = async (request, response) => {
	if (!objectContainsAllKeys(request.session, 'linkableAppeal')) {
		return response.render('app/500.njk');
	}

	const {
		params: { appealId }
	} = request;

	const targetAppealDetails = await getAppealDetailsFromId(request.apiClient, appealId);
	let linkCandidateAppealData;

	if (request.session.linkableAppeal?.linkableAppealSummary.source === 'back-office') {
		linkCandidateAppealData = await getAppealDetailsFromId(request.apiClient, request.session.linkableAppeal?.linkableAppealSummary.appealId);
	}

	const mappedPageContent = await addLinkedAppealCheckAndConfirmPage(
		targetAppealDetails,
		request.session.linkableAppeal?.linkableAppealSummary,
		linkCandidateAppealData
	);

	return response.render('patterns/check-and-confirm-page.pattern.njk', {
		pageContent: mappedPageContent
	});
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const postAddLinkedAppealCheckAndConfirm = async (request, response) => {
	if (!objectContainsAllKeys(request.session, 'linkableAppeal')) {
		return response.render('app/500.njk');
	}

	const {
		errors,
		params: { appealId },
		body: { confirmation }
	} = request;

	if (errors) {
		return renderAddLinkedAppealCheckAndConfirm(request, response);
	}

	try {
		const targetIsLead = confirmation === 'child';

		if (confirmation === 'cancel') {
			return response.redirect('/appeals-service/appeal-details/4428/linked-appeals/add');
		}
		else if (request.session.linkableAppeal?.linkableAppealSummary.source === 'back-office') {
			await linkAppealToBackOfficeAppeal(
				request.apiClient,
				appealId,
				request.session.linkableAppeal?.linkableAppealSummary.appealId,
				targetIsLead
			);
		}
		else {
			 await linkAppealToLegacyAppeal(
				request.apiClient,
				appealId,
				request.session.linkableAppeal?.linkableAppealSummary.appealReference,
				targetIsLead
			);
		}

		addNotificationBannerToSession(
			request.session,
			'appealLinked',
			appealId,
			`<p class="govuk-notification-banner__heading">This appeal is now ${targetIsLead ? 'the lead for' : 'a child of' } appeal ${request.session.linkableAppeal?.linkableAppealSummary.appealReference}</p>`
		);

		delete request.session.linkableAppeal;

		return response.redirect('/appeals-service/appeal-details/4428');
	} catch (error) {
		logger.error(error);
	}

	return response.render('app/500.njk');
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const getUnlinkAppeal = async (request, response) => {
	return renderUnlinkAppeal(request, response);
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const postUnlinkAppeal = async (request, response) => {
	try {
		const { appealId, parentId, childRef } = request.params;
		const { unlinkAppeal } = request.body;
		const { errors } = request;

		if (errors) {
			return renderUnlinkAppeal(request, response);
		}

		if (unlinkAppeal === 'no') {
			return response.redirect(
				`/appeals-service/appeal-details/${appealId}/manage-linked-appeals/linked-appeals`
			);
		}
		if (unlinkAppeal === 'yes') {
			addNotificationBannerToSession(
				request.session,
				'appealUnlinked',
				appealId,
				`<p class="govuk-notification-banner__heading">You have unlinked this appeal from appeal ${appealId}</p>`
			);
			await postUnlinkRequest(request.apiClient, parentId, childRef);
			return response.redirect(`/appeals-service/appeal-details/${appealId}`);
		}

		return response.redirect(
			`/appeals-service/appeal-details/${appealId}/change-appeal-type/change-appeal-final-date`
		);
	} catch (error) {
		return response.render('app/500.njk');
	}
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderUnlinkAppeal = async (request, response) => {
	const { errors } = request;

	const { appealId, parentRef, childRef } = request.params;

	const appealData = await getAppealDetailsFromId(request.apiClient, appealId);

	const mappedPageContent = await unlinkAppealPage(appealData, parentRef, childRef);

	return response.render('patterns/display-page.pattern.njk', {
		pageContent: mappedPageContent,
		errors
	});
};
