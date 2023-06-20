/**
 * @typedef {object} SummaryListRowActionsParameter
 * @property {Array<object>} items
 */
/**
 * Return the correct parameter object to be passed to a govukSummaryList row's actions property, depending on the supplied documentStatus
 *
 * @param {string} documentStatus
 * @param {string} href
 * @param {string} text
 * @param {string} visuallyHiddenText
 * @returns {SummaryListRowActionsParameter}
 */
export const actionsParameterForDocumentStatus = (
	documentStatus = '',
	href = '#',
	text = 'Review',
	visuallyHiddenText = ''
) => {
	switch (documentStatus.toLowerCase()) {
		case 'complete':
		case 'incomplete':
		case 'overdue':
			return {
				items: [
					{
						href,
						text,
						visuallyHiddenText
					}
				]
			};
		case 'not started':
		case 'none':
			return {
				items: []
			};
		default:
			return {
				items: []
			};
	}
};
