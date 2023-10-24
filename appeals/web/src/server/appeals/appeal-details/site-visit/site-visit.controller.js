import logger from '#lib/logger.js';
import * as appealDetailsService from '../appeal-details.service.js';
import * as siteVisitService from './site-visit.service.js';
import {
	mapWebVisitTypeToApiVisitType,
	mapGetApiVisitTypeToWebVisitType,
	buildSiteDetailsSummaryListRows
} from './site-visit.mapper.js';
import {
	hourMinuteToApiDateString,
	dayMonthYearToApiDateString,
	dateToDisplayDate
} from '#lib/dates.js';
import { appealShortReference } from '#lib/appeals-formatter.js';
import { addNotificationBannerToSession } from '#lib/session-utilities.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderScheduleSiteVisit = async (request, response) => {
	const { errors } = request;

	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.apiClient, request.params.appealId)
		.catch((error) => logger.error(error));

	if (appealDetails) {
		let {
			body: {
				'visit-type': visitType,
				'visit-date-day': visitDateDay,
				'visit-date-month': visitDateMonth,
				'visit-date-year': visitDateYear,
				'visit-start-time-hour': visitStartTimeHour,
				'visit-start-time-minute': visitStartTimeMinute,
				'visit-end-time-hour': visitEndTimeHour,
				'visit-end-time-minute': visitEndTimeMinute
			}
		} = request;

		// Nullish coalescing assignment https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_assignment
		visitType ??= mapGetApiVisitTypeToWebVisitType(appealDetails.siteVisit.visitType);
		visitDateDay ??= appealDetails.siteVisit?.visitDate
			? new Date(appealDetails.siteVisit?.visitDate).getDate()
			: null;
		visitDateMonth ??= appealDetails.siteVisit?.visitDate
			? new Date(appealDetails.siteVisit?.visitDate).getMonth() + 1
			: null;
		visitDateYear ??= appealDetails.siteVisit?.visitDate
			? new Date(appealDetails.siteVisit?.visitDate).getFullYear()
			: null;
		visitStartTimeHour ??= appealDetails.siteVisit?.visitStartTime
			? appealDetails.siteVisit?.visitStartTime.split(':')[0]
			: null;
		visitStartTimeMinute ??= appealDetails.siteVisit?.visitStartTime
			? appealDetails.siteVisit?.visitStartTime.split(':')[1]
			: null;
		visitEndTimeHour ??= appealDetails.siteVisit?.visitEndTime
			? appealDetails.siteVisit?.visitEndTime.split(':')[0]
			: null;
		visitEndTimeMinute ??= appealDetails.siteVisit?.visitEndTime
			? appealDetails.siteVisit?.visitEndTime.split(':')[1]
			: null;

		const healthAndSafetyIssues = [];
		if (appealDetails.healthAndSafety?.appellantCase?.hasIssues) {
			healthAndSafetyIssues.push(appealDetails.healthAndSafety?.appellantCase?.details);
		}
		if (appealDetails.healthAndSafety?.lpaQuestionnaire?.hasIssues) {
			healthAndSafetyIssues.push(appealDetails.healthAndSafety?.lpaQuestionnaire?.details);
		}

		const siteDetailsRows = await buildSiteDetailsSummaryListRows(
			{ appeal: appealDetails },
			request.originalUrl,
			request.session
		);

		return response.render('appeals/appeal/schedule-site-visit.njk', {
			siteDetailsRows,
			appeal: {
				id: appealDetails?.appealId,
				shortReference: appealShortReference(appealDetails?.appealReference)
			},
			siteVisit: {
				visitType,
				visitDateDay,
				visitDateMonth,
				visitDateYear,
				visitStartTimeHour,
				visitStartTimeMinute,
				visitEndTimeHour,
				visitEndTimeMinute
			},
			errors
		});
	}

	return response.render('app/404.njk');
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const renderScheduleSiteVisitConfirmation = async (request, response) => {
	const {
		params: { appealId }
	} = request;

	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.apiClient, request.params.appealId)
		.catch((error) => logger.error(error));

	if (appealDetails) {
		const siteVisitIdAsNumber = appealDetails.siteVisit?.siteVisitId;
		if (typeof siteVisitIdAsNumber === 'number' && !Number.isNaN(siteVisitIdAsNumber)) {
			const appealIdNumber = parseInt(appealId, 10);
			const siteVisit = await siteVisitService.getSiteVisit(
				request.apiClient,
				appealIdNumber,
				siteVisitIdAsNumber
			);

			if (siteVisit) {
				const formattedSiteVisitType = siteVisit.visitType.toLowerCase();
				const formattedSiteAddress = appealDetails?.appealSite
					? Object.values(appealDetails?.appealSite)?.join(', ')
					: 'Address not known';
				const formattedSiteVisitDate = dateToDisplayDate(siteVisit.visitDate);

				return response.render('app/confirmation.njk', {
					panel: {
						title: 'Site visit booked',
						appealReference: {
							label: 'Appeal ID',
							reference: appealShortReference(appealDetails?.appealReference)
						}
					},
					body: {
						preTitle: `Your ${formattedSiteVisitType} site visit at ${formattedSiteAddress} is booked for ${formattedSiteVisitDate}${
							formattedSiteVisitType !== 'unaccompanied'
								? `, starting at ${siteVisit.visitStartTime}`
								: ''
						}.`,
						title: {
							text: 'What happens next'
						},
						rows: [
							{
								text: `We updated the case timetable.${
									formattedSiteVisitType !== 'unaccompanied'
										? ` We've sent an email to the LPA and appellant to confirm the site visit.`
										: ''
								}`
							},
							{
								text: 'Go back to case details',
								href: `/appeals-service/appeal-details/${appealId}`
							}
						]
					}
				});
			}
		}
	}

	return response.render('app/404.njk');
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderSetVisitType = async (request, response) => {
	const { errors } = request;

	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.apiClient, request.params.appealId)
		.catch((error) => logger.error(error));

	if (appealDetails) {
		const {
			body: { 'visit-type': visitType }
		} = request;

		return response.render('appeals/appeal/set-site-visit-type.njk', {
			appeal: {
				id: appealDetails?.appealId,
				reference: appealDetails?.appealReference,
				shortReference: appealShortReference(appealDetails?.appealReference)
			},
			siteVisit: {
				visitType
			},
			errors
		});
	}

	return response.render('app/404.njk');
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getScheduleSiteVisit = async (request, response) => {
	renderScheduleSiteVisit(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postScheduleSiteVisit = async (request, response) => {
	const { errors } = request;

	if (errors) {
		return renderScheduleSiteVisit(request, response);
	}

	const {
		params: { appealId }
	} = request;

	try {
		const appealDetails = await appealDetailsService
			.getAppealDetailsFromId(request.apiClient, appealId)
			.catch((error) => logger.error(error));

		if (appealDetails) {
			const {
				body: {
					'visit-type': visitType,
					'visit-date-day': visitDateDay,
					'visit-date-month': visitDateMonth,
					'visit-date-year': visitDateYear,
					'visit-start-time-hour': visitStartTimeHour,
					'visit-start-time-minute': visitStartTimeMinute,
					'visit-end-time-hour': visitEndTimeHour,
					'visit-end-time-minute': visitEndTimeMinute
				}
			} = request;

			const appealIdNumber = parseInt(appealId, 10);
			const visitDate = dayMonthYearToApiDateString({
				day: parseInt(visitDateDay, 10),
				month: parseInt(visitDateMonth, 10),
				year: parseInt(visitDateYear, 10)
			});

			const visitStartTime = hourMinuteToApiDateString(visitStartTimeHour, visitStartTimeMinute);
			const visitEndTime = hourMinuteToApiDateString(visitEndTimeHour, visitEndTimeMinute);
			const apiVisitType = mapWebVisitTypeToApiVisitType(visitType);

			if (appealDetails.siteVisit?.siteVisitId) {
				await siteVisitService.updateSiteVisit(
					request.apiClient,
					appealIdNumber,
					appealDetails.siteVisit?.siteVisitId,
					apiVisitType,
					visitDate,
					visitStartTime,
					visitEndTime
				);
			} else {
				await siteVisitService.createSiteVisit(
					request.apiClient,
					appealIdNumber,
					apiVisitType,
					visitDate,
					visitStartTime,
					visitEndTime
				);
			}

			return response.redirect(
				`/appeals-service/appeal-details/${appealDetails.appealId}/site-visit/visit-scheduled`
			);
		}
		return response.render('app/404.njk');
	} catch (error) {
		logger.error(
			error,
			error instanceof Error ? error.message : 'Something went wrong when scheduling the site visit'
		);

		return response.render('app/500.njk');
	}
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getSiteVisitScheduled = async (request, response) => {
	renderScheduleSiteVisitConfirmation(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getSetVisitType = async (request, response) => {
	renderSetVisitType(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postSetVisitType = async (request, response) => {
	const { errors } = request;

	if (errors) {
		return renderSetVisitType(request, response);
	}

	const {
		params: { appealId }
	} = request;

	try {
		const appealDetails = await appealDetailsService
			.getAppealDetailsFromId(request.apiClient, appealId)
			.catch((error) => logger.error(error));

		if (appealDetails) {
			const {
				body: { 'visit-type': visitType }
			} = request;

			const appealIdNumber = parseInt(appealId, 10);
			const apiVisitType = mapWebVisitTypeToApiVisitType(visitType);

			if (
				appealDetails.siteVisit?.siteVisitId !== null &&
				Number.isInteger(appealDetails.siteVisit?.siteVisitId) &&
				appealDetails.siteVisit?.siteVisitId > -1
			) {
				await siteVisitService.updateSiteVisit(
					request.apiClient,
					appealIdNumber,
					appealDetails.siteVisit?.siteVisitId,
					apiVisitType
				);

				addNotificationBannerToSession(request.session, 'siteVisitTypeSelected', appealIdNumber);

				return response.redirect(`/appeals-service/appeal-details/${appealDetails.appealId}`);
			}
		}

		return response.render('app/404.njk');
	} catch (error) {
		logger.error(
			error,
			error instanceof Error
				? error.message
				: 'Something went wrong when setting the site visit type'
		);

		return response.render('app/500.njk');
	}
};
