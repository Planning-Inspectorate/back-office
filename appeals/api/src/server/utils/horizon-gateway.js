import config from '#config/config.js';
import got from 'got';
import { horizonGetCaseRequestBody, parseHorizonGetCaseResponse } from './mapping/map-horizon.js';
import logger from './logger.js';
import nock from 'nock';
import {
	horizonGetCaseNotFoundResponse,
	horizonGetCaseNotPublishedResponse,
	horizonGetCaseSuccessResponse
} from '#tests/horizon/mocks.js';
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
 * @typedef {Object} HorizonAttributeValue
 * @property {string} value
 */

/**
 * @typedef {Object} HorizonAttributeSingle
 * @property {HorizonAttributeValue} Name
 * @property {HorizonAttributeValue} Value
 */

/**
 * @typedef {Object} HorizonAttributeMultiple
 * @property {HorizonAttributeValue} Name
 * @property {HorizonAttributeMap} Values
 */

/**
 * @typedef {Object<string, HorizonAttributeSingle|HorizonAttributeMultiple>} HorizonAttributeMap
 */

/**
 * @typedef HorizonCaseResults
 * @property {HorizonAttributeValue} CaseId
 * @property {{Email: HorizonAttributeValue, Name: HorizonAttributeValue}} CaseOfficer
 * @property {HorizonAttributeValue} CaseReference
 * @property {HorizonAttributeValue} CaseType
 * @property {HorizonAttributeValue} LPACode
 * @property {any} LinkedCases
 * @property {{Attributes: HorizonAttributeMap}} Metadata
 * @property {HorizonAttributeValue} ProcedureType
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
	if (config.horizon.mock) {
		switch (caseReference) {
			//Case found
			case '1000000':
				nock(config.horizon.url)
					.post('/horizon', requestBody)
					.reply(200, parseHorizonGetCaseResponse(horizonGetCaseSuccessResponse));
				break;
			//Case not published
			case '2000000':
				nock(config.horizon.url)
					.post('/horizon', requestBody)
					.reply(500, parseHorizonGetCaseResponse(horizonGetCaseNotPublishedResponse));
				break;
			//Case not found
			default:
				nock(config.horizon.url)
					.post('/horizon', requestBody)
					.reply(500, parseHorizonGetCaseResponse(horizonGetCaseNotFoundResponse));
				break;
		}
	}
	/**
	 * @type {Promise<HorizonGetCaseSuccessResponse>}
	 */
	const appealData = await got
		.post(url, {
			json: requestBody,
			parseJson: (data) => parseHorizonGetCaseResponse(data)
		})
		.json()
		.catch((error) => {
			if (error.response.body && JSON.stringify(error.response.body).includes('faultstring')) {
				if (
					JSON.stringify(error.response.body).includes('not found') ||
					JSON.stringify(error.response.body).includes('is not published')
				) {
					throw 404;
				}
			}
			logger.error(error.response.body);
			throw 500;
		});
	logger.debug('Found case on Horizon.');
	return appealData;
};
