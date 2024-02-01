import config from '#config/config.js';
import got from 'got';
import { horizonGetCaseRequestBody, parseHorizonGetCaseResponse } from './mapping/map-horizon.js';
import logger from './logger.js';
/**
 * @typedef HorizonGetCaseSuccessResponse
 * @property {{Body: {GetCaseResponse: {GetCaseResult: HorizonCaseResults}}}} Envelope
 *
 */

/**
 * @typedef HorizonGetCaseFailureResponse
 * @property {{Body: Fault}} Envelope
 *
 */

/**
 * @typedef Fault
 * @property {{value: string}} faultcode
 * @property {{value: string}} faultstring
 * @property {{ExceptionDetail: {HelpLink : any, InnerException: any, Message: {value: string}, StackTrace: {value: string}, Type: {value: string}}}} detail
 *
 */

/**
 * @typedef {{[x: string]: {Name: {value: string}, Value: {value: string}}}} HorizonAttributeValue
 */

/**
 * @typedef HorizonCaseResults
 * @property {{value: string}} CaseId
 * @property {{Email: {value: string}, Name: {value: string}}} CaseOfficer
 * @property {{value: string}} CaseReference
 * @property {{value: string}} CaseType
 * @property {{value: string}} LPACode
 * @property {any} LinkedCases
 * @property {{Attributes: HorizonAttributeValue | {Name: {value: string}, Values: HorizonAttributeValue }}} Metadata
 * @property {{value: string}} ProcedureType
 * @property {any} PublishedDocuments
 *
 */

/**
 *
 * @param {string} caseReference
 * @returns {Promise<HorizonGetCaseSuccessResponse>}
 */
export const getAppealFromHorizon = async (caseReference) => {
	const endpoint = 'horizon';
	const url = `${config.horizon.url}/${endpoint}`;

	const requestBody = horizonGetCaseRequestBody(caseReference);

	logger.debug('Case not found in BO, now trying to query Horizon');
	/**
	 * @type {Promise<HorizonGetCaseSuccessResponse>}
	 */
	const appealData = await got
		.post(url, {
			json: requestBody,
			parseJson: async (data) => await parseHorizonGetCaseResponse(data)
		})
		.json()
		.catch((error) => {
			logger.error(JSON.parse(JSON.stringify(error.response.body)).Envelope.Body.Fault.faultstring);
			if (JSON.parse(JSON.stringify(error.response.body)).Envelope.Body.Fault.faultstring) {
				if (
					JSON.parse(
						JSON.stringify(error.response.body)
					).Envelope.Body.Fault.faultstring.value.includes('not found')
				) {
					throw 404;
				} else {
					throw 500;
				}
			}
			return error.response.body;
		});

	logger.debug('Found case on Horizon.');
	return appealData;
};
