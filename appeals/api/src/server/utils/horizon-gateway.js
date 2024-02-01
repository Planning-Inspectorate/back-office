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
