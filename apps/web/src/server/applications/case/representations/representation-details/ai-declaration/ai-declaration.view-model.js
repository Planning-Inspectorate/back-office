/**
 * @typedef {import('../../relevant-representation.types.js').Representation} Representation
 */

/**
 * @param {string|null} useOfAI
 * @returns {Array<Object>}
 */
const getRadioItems = (useOfAI) => {
	const optionsList = [
		{
			value: 'NO',
			text: 'AI not used',
			checked: false
		},
		{
			value: 'YES',
			text: 'AI used',
			checked: false
		},
		{
			value: 'UNKNOWN',
			text: 'Unknown',
			checked: false
		}
	];

	return optionsList.map((option) => {
		if (option.value === useOfAI) {
			option.checked = true;
		}
		return option;
	});
};

/**
 * @param {string} caseId
 * @param {string} repId
 * @param {Representation} representationDetails
 * @param {string|null} useOfAIBodyValue
 * @returns {object}
 */
export const getAiDeclarationViewModel = (
	caseId,
	repId,
	representationDetails,
	useOfAIBodyValue
) => {
	const oldUseOfAI = representationDetails.useOfAI;
	const useOfAI = useOfAIBodyValue ? useOfAIBodyValue : oldUseOfAI;

	return {
		caseId,
		repId,
		radioItems: getRadioItems(useOfAI),
		backLinkUrl: `/applications-service/case/${caseId}/relevant-representations/${repId}/representation-details`
	};
};
