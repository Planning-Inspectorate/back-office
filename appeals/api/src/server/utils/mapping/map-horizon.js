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
 * @returns {import("#utils/horizon-gateway.js").HorizonGetCaseSuccessResponse|import("#utils/horizon-gateway.js").HorizonGetCaseFailureResponse}
 */
export const parseHorizonGetCaseResponse = (data) => {
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
};

/**
 * @typedef UndefinedObject
 * @type {{ [x: string]: string; }}
 */

/**
 * @param {import("#utils/horizon-gateway.js").HorizonGetCaseSuccessResponse} data
 *
 * @returns {import("#endpoints/linkable-appeals/linkable-appeals.service.js").LinkableAppealSummary}
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
			siteAddressLine1: convertedData['Case Site:Site Address Line 1'],
			siteAddressLine2: convertedData['Case Site:Site Address Line 2'],
			siteAddressTown: convertedData['Case Site:Site Address Town'],
			siteAddressCounty: convertedData['Case Site:Site Address County'],
			siteAddressPostcode: convertedData['Case Site:Site Address Postcode']
		},
		localPlanningDepartment: convertedData['Case:LPA Name'],
		appellantName:
			convertedData['Case Involvement:Case Involvement'].findIndex(
				(/** @type {UndefinedObject} */ value) =>
					value['Case Involvement:Case Involvement:Type Of Involvement'] === 'Appellant'
			) >= 0
				? convertedData['Case Involvement:Case Involvement'][
						convertedData['Case Involvement:Case Involvement'].findIndex(
							(/** @type {UndefinedObject} */ value) =>
								value['Case Involvement:Case Involvement:Type Of Involvement'] === 'Appellant'
						)
				  ]['Case Involvement:Case Involvement:Contact Details']
				: null,
		agentName:
			convertedData['Case Involvement:Case Involvement'].findIndex(
				(/** @type {UndefinedObject} */ value) =>
					value['Case Involvement:Case Involvement:Type Of Involvement'] === 'Agent'
			) >= 0
				? convertedData['Case Involvement:Case Involvement'][
						convertedData['Case Involvement:Case Involvement'].findIndex(
							(/** @type {UndefinedObject} */ value) =>
								value['Case Involvement:Case Involvement:Type Of Involvement'] === 'Agent'
						)
				  ]['Case Involvement:Case Involvement:Contact Details']
				: null,
		submissionDate: new Date(convertedData['Case Dates:Receipt Date']).toISOString(),
		source: 'horizon'
	};
};

/**
 *
 * @param {*} parsedData
 * @returns {*}
 */
const convertSOAPKeyValuePairToJSON = (parsedData) => {
	/**
	 * @type {{[x: string]: any}}
	 */
	const formattedData = {};

	//Process metadata
	let metadata = parsedData.Envelope.Body.GetCaseResponse.GetCaseResult.Metadata.Attributes;

	for (const value in metadata) {
		if (Object.hasOwn(metadata[value], 'Values')) {
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
			formattedData[metadata[value].Name.value] = metadata[value].Value.value;
		}
	}
	return formattedData;
};

//TODO: add data mapper once we know appeal statuses and types for sure.