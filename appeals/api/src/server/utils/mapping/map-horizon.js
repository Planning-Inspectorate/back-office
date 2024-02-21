export const horizonGetCaseRequestBody = (/** @type {string} */ caseReference) => {
	return {
		GetCase: {
			__soap_op: 'http://tempuri.org/IHorizon/GetCase',
			__xmlns: 'http://tempuri.org/',
			caseReference: caseReference
		}
	};
};

/**
 *
 * @param {string} data
 * @returns {import("#utils/horizon-gateway.js").HorizonGetCaseSuccessResponse|import("#utils/horizon-gateway.js").HorizonGetCaseFailureResponse|undefined}
 */
export const parseHorizonGetCaseResponse = (data) => {
	if (data) {
		let unparsedResponse = data;
		let i = 0;
		let parseComplete = false;

		while (!parseComplete) {
			if (unparsedResponse.includes('"AttributeValue":')) {
				unparsedResponse = unparsedResponse.replace('"AttributeValue":', `"AttributeValue${i}":`);
				i++;
			} else {
				parseComplete = true;
			}
		}
		return JSON.parse(unparsedResponse);
	}
};

/**
 * @typedef {{ [x: string]: string; }} UnnamedStringObject
 */

/**
 * @param {import("#utils/horizon-gateway.js").HorizonGetCaseSuccessResponse} data
 * @returns {import("#endpoints/linkable-appeals/linkable-appeal.service.js").LinkableAppealSummary}
 */
export const formatHorizonGetCaseData = (data) => {
	const convertedData = convertSOAPKeyValuePairToJSON(data);
	return {
		appealId: data.Envelope.Body.GetCaseResponse.GetCaseResult.CaseId.value,
		appealReference: data.Envelope.Body.GetCaseResponse.GetCaseResult.CaseReference.value
			.split('/')
			.pop(),
		appealType: data.Envelope.Body.GetCaseResponse.GetCaseResult.CaseType.value,
		appealStatus: convertedData['Case:Processing State'],
		siteAddress: {
			addressLine1: convertedData['Case Site:Site Address Line 1'],
			addressLine2: convertedData['Case Site:Site Address Line 2'],
			town: convertedData['Case Site:Site Address Town'],
			county: convertedData['Case Site:Site Address County'],
			postCode: convertedData['Case Site:Site Address Postcode']
		},
		localPlanningDepartment: convertedData['Case:LPA Name'],
		appellantName:
			convertedData['Case Involvement:Case Involvement'].findIndex(
				(/** @type {UnnamedStringObject} */ value) =>
					value['Case Involvement:Case Involvement:Type Of Involvement'] === 'Appellant'
			) >= 0
				? convertedData['Case Involvement:Case Involvement'][
						convertedData['Case Involvement:Case Involvement'].findIndex(
							(/** @type {UnnamedStringObject} */ value) =>
								value['Case Involvement:Case Involvement:Type Of Involvement'] === 'Appellant'
						)
				  ]['Case Involvement:Case Involvement:Contact Details']
				: null,
		agentName:
			convertedData['Case Involvement:Case Involvement'].findIndex(
				(/** @type {UnnamedStringObject} */ value) =>
					value['Case Involvement:Case Involvement:Type Of Involvement'] === 'Agent'
			) >= 0
				? convertedData['Case Involvement:Case Involvement'][
						convertedData['Case Involvement:Case Involvement'].findIndex(
							(/** @type {UnnamedStringObject} */ value) =>
								value['Case Involvement:Case Involvement:Type Of Involvement'] === 'Agent'
						)
				  ]['Case Involvement:Case Involvement:Contact Details']
				: null,
		submissionDate: new Date(convertedData['Case Dates:Receipt Date']).toISOString(),
		source: 'horizon'
	};
};
/**
 * @param {import("#utils/horizon-gateway.js").HorizonAttributeMultiple|import("#utils/horizon-gateway.js").HorizonAttributeSingle} value
 * @return {value is import("#utils/horizon-gateway.js").HorizonAttributeMultiple}
 */
function isHorizonAttributeMultiple(value) {
	return Object.hasOwn(value, 'Values');
}

/**
 *
 * @param {import("#utils/horizon-gateway.js").HorizonGetCaseSuccessResponse} parsedData
 * @returns {Object<string, any>}
 */
const convertSOAPKeyValuePairToJSON = (parsedData) => {
	/**
	 * @type {Object<string, any>}
	 */
	const formattedData = {};

	//Process metadata
	const metadata = parsedData.Envelope.Body.GetCaseResponse.GetCaseResult.Metadata.Attributes;

	for (const value in metadata) {
		if (isHorizonAttributeMultiple(metadata[value])) {
			// @ts-ignore
			const subObject = metadata[value].Values;
			/**
			 * @type {{[x: string]: any}}
			 */
			const innerObjects = {};

			for (const subValue in subObject) {
				innerObjects[subObject[subValue].Name.value] = subObject[subValue].Value.value;
			}
			if (Array.isArray(formattedData[metadata[value].Name.value])) {
				formattedData[metadata[value].Name.value].push(innerObjects);
			} else {
				formattedData[metadata[value].Name.value] = [];
				formattedData[metadata[value].Name.value].push(innerObjects);
			}
		} else {
			// @ts-ignore
			formattedData[metadata[value].Name.value] = metadata[value].Value.value;
		}
	}
	return formattedData;
};

//TODO: add data mapper once we know appeal statuses and types for sure.
