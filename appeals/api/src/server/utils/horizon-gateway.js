import config from '#config/config.js';
import got from 'got';
import {
	formatHorizonGetCaseData,
	horizonGetCaseRequestBody,
	parseHorizonGetCaseResponse
} from './mapping/map-horizon.js';
import logger from './logger.js';

/**
 * @typedef {object} LinkableAppealSummary
 * @property {string | undefined} appealReference
 * @property {string | undefined} appealType
 * @property {string} appealStatus
 * @property {{siteAddressLine1: string | undefined | null, siteAddressLine2: string | undefined | null, siteAddressTown: string | undefined | null, siteAddressCounty: string | undefined | null, siteAddressPostcode: string | undefined | null}} siteAddress
 * @property {string} localPlanningDepartment
 * @property {string | undefined} appellantName
 * @property {string | undefined | null} [agentName]
 * @property {string} submissionDate
 */
/**
 *
 * @param {string} caseReference
 * @returns {Promise<LinkableAppealSummary>}
 */
export const getAppealFromHorizon = async (caseReference) => {
	const endpoint = 'horizon';
	const url = `${config.horizon.url}/${endpoint}`;

	const requestBody = horizonGetCaseRequestBody(caseReference);

	logger.debug('Case not found in BO, now trying to query Horizon');
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

	logger.debug('Found case on Horizon. Now formatting...');
	return formatHorizonGetCaseData(appealData);
};
