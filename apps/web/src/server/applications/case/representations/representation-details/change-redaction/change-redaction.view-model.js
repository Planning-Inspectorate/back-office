/**
 *
 * @param {*} representationDetails
 * @param {string} caseId
 * @param {string} representationId
 * @return {{pageHeading: string, backLink: string, pageTitle: string, name: string, representationDetails: *, radioItems: [{checked: boolean, text: string, value: boolean},{checked: boolean, text: string, value: boolean}]}}
 */
export const getRepresentationDetailsChangeRedactionViewModel = (
	representationDetails,
	caseId,
	representationId
) => ({
	representationDetails,
	backLink: `/applications-service/case/${caseId}/relevant-representations/${representationId}/representation-details`,
	pageTitle: 'Change redaction',
	pageHeading: 'Change redaction',
	name: 'changeRedaction',
	radioItems: [
		{
			value: true,
			text: 'Redacted',
			checked: false
		},
		{
			value: false,
			text: 'Unredacted',
			checked: false
		}
	]
});
