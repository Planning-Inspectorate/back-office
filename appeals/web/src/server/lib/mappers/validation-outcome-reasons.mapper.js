/**
 * @typedef {import('../../appeals/appeal-details/appeal-details.types.js').BodyValidationOutcome} BodyValidationOutcome
 * @typedef {import('../../appeals/appeal-details/appeal-details.types.js').NotValidReasonOption} NotValidReasonOption
 * @typedef {import('../../appeals/appeal-details/appeal-details.types.js').NotValidReasonResponse} NotValidReasonResponse
 * @typedef {import('../../appeals/appeal-details/lpa-questionaire/lpa-questionnaire.types.js').LPAQuestionnaireSessionValidationOutcome} LPAQuestionnaireSessionValidationOutcome
 * @typedef {import('../../appeals/appeal-details/appellant-case/appellant-case.types.js').AppellantCaseSessionValidationOutcome} AppellantCaseSessionValidationOutcome
 */

/**
 *
 * @param {NotValidReasonOption[]} reasonOptions
 * @param {number[]|undefined} checkedOptions
 * @param {NotValidReasonResponse[]} existingReasons
 * @param {BodyValidationOutcome} bodyValidationOutcome
 * @param {string} bodyValidationBaseKey
 * @param {AppellantCaseSessionValidationOutcome|LPAQuestionnaireSessionValidationOutcome|undefined} sessionValidationOutcome
 * @returns {import('../../appeals/appeals.types.js').CheckboxItemParameter[]}
 */
export function mapReasonOptionsToCheckboxItemParameters(
	reasonOptions,
	checkedOptions,
	existingReasons,
	bodyValidationOutcome,
	bodyValidationBaseKey,
	sessionValidationOutcome
) {
	return reasonOptions.map((reason) => {
		const addAnotherTextItemsFromExistingOutcome = getAddAnotherTextItemsFromExistingOutcome(
			reason,
			existingReasons
		);
		const addAnotherTextItemsFromSession = getAddAnotherTextItemsFromSession(
			reason,
			sessionValidationOutcome
		);
		const addAnotherTextItemsFromBody = getAddAnotherTextItemsFromBody(
			reason,
			bodyValidationOutcome,
			bodyValidationBaseKey
		);

		let textItems = [''];

		if (addAnotherTextItemsFromBody) {
			textItems = addAnotherTextItemsFromBody;
		} else if (addAnotherTextItemsFromSession) {
			textItems = addAnotherTextItemsFromSession;
		} else if (addAnotherTextItemsFromExistingOutcome) {
			textItems = addAnotherTextItemsFromExistingOutcome;
		}

		return {
			value: `${reason.id}`,
			text: reason.name,
			checked: checkedOptions?.includes(reason.id) || false,
			...(reason.hasText && {
				addAnother: { textItems }
			})
		};
	});
}

/**
 *
 * @param {NotValidReasonOption} reasonOption
 * @param {NotValidReasonResponse[]} existingReasons
 * @returns {string[]|undefined}
 */
function getAddAnotherTextItemsFromExistingOutcome(reasonOption, existingReasons) {
	return existingReasons.find((existingReason) => existingReason?.name?.id === reasonOption.id)
		?.text;
}

/**
 *
 * @param {NotValidReasonOption} reasonOption
 * @param {AppellantCaseSessionValidationOutcome|LPAQuestionnaireSessionValidationOutcome|undefined} sessionValidationOutcome
 * @returns {string[]|undefined}
 */
function getAddAnotherTextItemsFromSession(reasonOption, sessionValidationOutcome) {
	return sessionValidationOutcome?.reasonsText?.[reasonOption.id];
}

/**
 *
 * @param {NotValidReasonOption} reasonOption
 * @param {BodyValidationOutcome|undefined} bodyValidationOutcome
 * @param {string} bodyValidationBaseKey
 * @returns {string[]|undefined}
 */
function getAddAnotherTextItemsFromBody(
	reasonOption,
	bodyValidationOutcome,
	bodyValidationBaseKey
) {
	/** @type {string[]|undefined} */
	let addAnotherTextItemsFromBody =
		Object.keys(bodyValidationOutcome || {}).length &&
		(bodyValidationOutcome || {})[`${bodyValidationBaseKey}-${reasonOption.id}`];

	if (addAnotherTextItemsFromBody) {
		if (!Array.isArray(addAnotherTextItemsFromBody)) {
			addAnotherTextItemsFromBody = [addAnotherTextItemsFromBody];
		}

		return addAnotherTextItemsFromBody.filter((textItem) => textItem.length);
	}
}

/**
 *
 * @param {NotValidReasonOption[]} reasonOptions
 * @param {string|string[]|undefined} reasons
 * @param {Object<string, string[]>|undefined} reasonsText
 * @returns {Array<string|string[]>}
 */
export function mapReasonsToReasonsList(reasonOptions, reasons, reasonsText) {
	if (!reasons) {
		reasons = [];
	}

	if (!Array.isArray(reasons)) {
		reasons = [reasons];
	}

	return (
		reasons
			?.map((reason) => reasonOptions.find((option) => option.id === parseInt(reason || '', 10)))
			.map((option) => {
				if (!option) {
					throw new Error('invalid or incomplete reason ID was not recognised');
				}

				/** @type {string[]} */
				let textItems = [];

				if (option.hasText && reasonsText && reasonsText[option.id]) {
					textItems = reasonsText[option.id];
				}

				/** @type {Array<string|string[]>} */
				const list = [`${option.name}${textItems.length ? ':' : ''}`];

				if (textItems.length) {
					list.push(textItems);
				}

				return list;
			})
			.flat() || ['']
	);
}

/**
 *
 * @param {Object<string, any>} requestBody
 * @param {'invalidReason'|'incompleteReason'} reasonKey
 * @returns {Object<string, string[]>}
 */
export function getNotValidReasonsTextFromRequestBody(requestBody, reasonKey) {
	if (!requestBody[reasonKey]) {
		throw new Error(`reasonKey "${reasonKey}" not found in requestBody`);
	}

	/** @type {Object<string, string[]>} */
	const reasonsText = {};

	let bodyReasonIds = Array.isArray(requestBody[reasonKey])
		? requestBody[reasonKey]
		: [requestBody[reasonKey]];

	for (const reasonId of bodyReasonIds) {
		const textItemsKey = `${reasonKey}-${reasonId}`;

		if (requestBody[textItemsKey]) {
			const reasonsTextKey = `${reasonId}`;
			reasonsText[reasonsTextKey] = Array.isArray(requestBody[textItemsKey])
				? requestBody[textItemsKey]
				: [requestBody[textItemsKey]];

			reasonsText[reasonsTextKey] = reasonsText[reasonsTextKey].filter(
				(reason) => reason.length > 0
			);
		}
	}

	return reasonsText;
}
