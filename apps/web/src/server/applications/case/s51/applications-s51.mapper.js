/** @typedef {import('../../applications.types.js').S51Advice} S51Advice */
/** @typedef {import('./applications-s51.types.js').ApplicationsS51UpdateBody} ApplicationsS51UpdateBody */
/** @typedef {import('./applications-s51.types.js').ApplicationsS51UpdatePayload} ApplicationsS51UpdatePayload */
/** @typedef {import('./applications-s51.types.js').S51AdviceForm} S51AdviceForm */

import { dateString } from '../../../lib/nunjucks-filters/date.js';

/**
 *
 * @param {{number?: string, size?: string}} query
 * @param {number} defaultPageSize
 * @returns {{pageSize: number, pageNumber: number}}
 */
export const getIntegerRequestQuery = ({ number, size }, defaultPageSize) => {
	const pageNumber = Number(number || '1');
	const numberSize = Number(size ?? NaN);
	const pageSize = !Number.isNaN(numberSize) ? numberSize : defaultPageSize;

	return { pageSize, pageNumber };
};

/**
 * Transform ApplicationsS51UpdatePayload to ApplicationsS51UpdateBody
 *
 * @param {S51Advice} payload
 * @returns {ApplicationsS51UpdateBody}
 * */
export const mapS51AdviceToPage = (payload) => {
	const enquiryDate = new Date(payload.enquiryDate);
	const adviceDate = new Date(payload.adviceDate);

	return {
		...payload,
		'enquiryDate.day': String(enquiryDate.getDate()),
		'enquiryDate.month': String(enquiryDate.getMonth() + 1),
		'enquiryDate.year': String(enquiryDate.getFullYear()),
		'adviceDate.day': String(adviceDate.getDate()),
		'adviceDate.month': String(adviceDate.getMonth() + 1),
		'adviceDate.year': String(adviceDate.getFullYear())
	};
};

/**
 * Transform ApplicationsS51UpdateBody to ApplicationsS51UpdatePayload
 *
 * @param {ApplicationsS51UpdateBody} body
 * @returns {ApplicationsS51UpdatePayload}
 * */
export const mapUpdateBodyToPayload = (body) => {
	/** @type {ApplicationsS51UpdatePayload} */
	let payload = {
		title: body.title,
		firstName: body.firstName,
		lastName: body.lastName,
		enquirer: body.enquirer,
		enquiryMethod: body.enquiryMethod,
		enquiryDetails: body.enquiryDetails,
		adviser: body.adviser,
		adviceDetails: body.adviceDetails,
		redactedStatus: body.redactedStatus,
		publishedStatus: body.publishedStatus
	};

	if (body['enquiryDate.day'] && body['enquiryDate.month'] && body['enquiryDate.year']) {
		payload.enquiryDate = new Date(
			parseInt(body['enquiryDate.year']),
			parseInt(body['enquiryDate.month']) - 1,
			parseInt(body['enquiryDate.day'])
		);
	}

	if (body['adviceDate.day'] && body['adviceDate.month'] && body['adviceDate.year']) {
		payload.adviceDate = new Date(
			parseInt(body['adviceDate.year']),
			parseInt(body['adviceDate.month']) - 1,
			parseInt(body['adviceDate.day'])
		);
	}

	return payload;
};

/**
 * Refines the S51Advice data to display on the check your answers page
 *
 * @param { Partial<S51AdviceForm> | null } data
 */
export const getCheckYourAnswersRows = (data) => {
	if (!data) return {};

	const enquiryDateString = [
		data['enquiryDate.year'],
		data['enquiryDate.month'],
		data['enquiryDate.day']
	].join('-');
	const enquiryDate = new Date(enquiryDateString).toISOString();

	const adviceDateString = [
		data['adviceDate.year'],
		data['adviceDate.month'],
		data['adviceDate.day']
	].join('-');
	const adviceDate = new Date(adviceDateString).toISOString();
	const enquirerLabel = `${data?.enquirerFirstName} ${data?.enquirerLastName}${
		(data?.enquirerFirstName || data?.enquirerLastName) && data?.enquirerOrganisation ? ', ' : ''
	}${data?.enquirerOrganisation}`;

	return {
		title: data.title,
		enquirer: data.enquirerOrganisation,
		enquirerLabel,
		firstName: data.enquirerFirstName,
		lastName: data.enquirerLastName,
		enquiryMethod: data.enquiryMethod,
		enquiryDateDisplay: dateString(
			data['enquiryDate.year'],
			data['enquiryDate.month'],
			data['enquiryDate.day']
		),
		enquiryDate: enquiryDate,
		enquiryDetails: data.enquiryDetails,
		adviser: data.adviser,
		adviceDateDisplay: dateString(
			data['adviceDate.year'],
			data['adviceDate.month'],
			data['adviceDate.day']
		),
		adviceDate: adviceDate,
		adviceDetails: data.adviceDetails
	};
};
