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
 * @param {'schedule' | 'manage'} pageType
 */
const renderScheduleOrManageSiteVisit = async (request, response, pageType) => {
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

		let titlePrefix = '';

		if (pageType === 'schedule') {
			titlePrefix = 'Schedule';
		} else if (pageType === 'manage') {
			titlePrefix = 'Manage';
		}

		return response.render('appeals/appeal/schedule-site-visit.njk', {
			titlePrefix,
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
export const renderScheduleOrManageSiteVisitConfirmation = async (request, response) => {
	const {
		params: { appealId, confirmationPageTypeToRender }
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

				const timeText =
					siteVisit.visitStartTime && siteVisit.visitEndTime
						? `, between ${siteVisit.visitStartTime} and ${siteVisit.visitEndTime}`
						: '';

				let contentObject;

				if (confirmationPageTypeToRender === 'new') {
					contentObject = {
						panel: {
							title: 'Site visit booked',
							appealReference: {
								label: 'Appeal ID',
								reference: appealShortReference(appealDetails?.appealReference)
							}
						},
						body: {
							preTitle: `Your ${formattedSiteVisitType} site visit at ${formattedSiteAddress} is booked for ${formattedSiteVisitDate}${timeText}.`,
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
					};
				} else if (confirmationPageTypeToRender === 'unchanged') {
					contentObject = {
						panel: {
							title: 'No changes were made',
							appealReference: {
								label: 'Appeal ID',
								reference: appealShortReference(appealDetails?.appealReference)
							}
						},
						body: {
							rows: [
								{
									text: `The original details still apply.`
								},
								{
									text: `No emails have been sent to the parties.`
								},
								{
									text: 'Go back to case details',
									href: `/appeals-service/appeal-details/${appealId}`
								}
							]
						}
					};
				} else if (confirmationPageTypeToRender === 'visit-type') {
					contentObject = {
						panel: {
							title: 'Site visit type changed',
							appealReference: {
								label: 'Appeal ID',
								reference: appealShortReference(appealDetails?.appealReference)
							}
						},
						body: {
							preTitle: `The visit type is now changed to ${formattedSiteVisitType}. Your site visit at ${formattedSiteAddress} is still scheduled for ${formattedSiteVisitDate}${timeText}.`,
							title: {
								text: 'What happens next'
							},
							rows: [
								{
									text: `We updated the case timetable.${
										formattedSiteVisitType !== 'unaccompanied'
											? ` We've sent an email to the LPA and appellant to confirm the changes to the site visit.`
											: ''
									}`
								},
								{
									text: 'Go back to case details',
									href: `/appeals-service/appeal-details/${appealId}`
								}
							]
						}
					};
				} else if (confirmationPageTypeToRender === 'date-time') {
					contentObject = {
						panel: {
							title: 'Site visit rescheduled',
							appealReference: {
								label: 'Appeal ID',
								reference: appealShortReference(appealDetails?.appealReference)
							}
						},
						body: {
							preTitle: `Your ${formattedSiteVisitType} site visit at ${formattedSiteAddress} is rescheduled for ${formattedSiteVisitDate}${timeText}.`,
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
					};
				} else if (confirmationPageTypeToRender === 'all') {
					contentObject = {
						panel: {
							title: 'Site visit changed',
							appealReference: {
								label: 'Appeal ID',
								reference: appealShortReference(appealDetails?.appealReference)
							}
						},
						body: {
							preTitle: `Your site visit at ${formattedSiteAddress} is rescheduled for ${formattedSiteVisitDate}${timeText}. The site visit type is now changed to ${formattedSiteVisitType}.`,
							title: {
								text: 'What happens next'
							},
							rows: [
								{
									text: `We updated the case timetable.${
										formattedSiteVisitType !== 'unaccompanied'
											? ` We've sent an email to the LPA and appellant to confirm the changes to the site visit.`
											: ''
									}`
								},
								{
									text: 'Go back to case details',
									href: `/appeals-service/appeal-details/${appealId}`
								}
							]
						}
					};
				}

				return response.render('app/confirmation.njk', contentObject);
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
export const renderSiteVisitBooked = async (request, response) => {
	const appealDetails = await appealDetailsService
		.getAppealDetailsFromId(request.apiClient, request.params.appealId)
		.catch((error) => logger.error(error));

	if (appealDetails) {
		const siteVisitIdAsNumber = appealDetails.siteVisit?.siteVisitId;

		if (typeof siteVisitIdAsNumber === 'number' && !Number.isNaN(siteVisitIdAsNumber)) {
			return response.render('appeals/appeal/site-visit-booked.njk', {
				appeal: {
					id: appealDetails?.appealId,
					reference: appealDetails?.appealReference,
					shortReference: appealShortReference(appealDetails?.appealReference)
				}
			});
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
	renderScheduleOrManageSiteVisit(request, response, 'schedule');
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getManageSiteVisit = async (request, response) => {
	renderScheduleOrManageSiteVisit(request, response, 'manage');
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postScheduleSiteVisit = async (request, response) => {
	postScheduleOrManageSiteVisit(request, response, 'schedule');
};

/** @type {import('@pins/express').RequestHandler<Response>} */
export const postManageSiteVisit = async (request, response) => {
	postScheduleOrManageSiteVisit(request, response, 'manage');
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {'schedule' | 'manage'} pageType
 */
export const postScheduleOrManageSiteVisit = async (request, response, pageType) => {
	const { errors } = request;

	if (errors) {
		return renderScheduleOrManageSiteVisit(request, response, pageType);
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
				const oldApiVisitType = appealDetails.siteVisit.visitType;
				const oldVisitDate = appealDetails.siteVisit.visitDate?.split('T')[0];
				const { visitStartTime: oldVisitStartTime } = appealDetails.siteVisit;
				const { visitEndTime: oldVisitEndTime } = appealDetails.siteVisit;

				const visitTypeChanged =
					oldApiVisitType &&
					apiVisitType &&
					oldApiVisitType.toLowerCase() !== apiVisitType.toLowerCase();
				const dateTimeChanged =
					oldVisitDate !== visitDate ||
					oldVisitStartTime !== visitStartTime ||
					oldVisitEndTime !== visitEndTime;

				let confirmationPageTypeToRender = 'unchanged';

				if (visitTypeChanged && !dateTimeChanged) {
					confirmationPageTypeToRender = 'visit-type';
				} else if (!visitTypeChanged && dateTimeChanged) {
					confirmationPageTypeToRender = 'date-time';
				} else if (visitTypeChanged && dateTimeChanged) {
					confirmationPageTypeToRender = 'all';
				}

				await siteVisitService.updateSiteVisit(
					request.apiClient,
					appealIdNumber,
					appealDetails.siteVisit?.siteVisitId,
					apiVisitType,
					visitDate,
					visitStartTime,
					visitEndTime
				);

				return response.redirect(
					`/appeals-service/appeal-details/${appealDetails.appealId}/site-visit/visit-scheduled/${confirmationPageTypeToRender}`
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

				return response.redirect(
					`/appeals-service/appeal-details/${appealDetails.appealId}/site-visit/visit-scheduled/new`
				);
			}
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
	renderScheduleOrManageSiteVisitConfirmation(request, response);
};

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getSiteVisitBooked = async (request, response) => {
	renderSiteVisitBooked(request, response);
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
