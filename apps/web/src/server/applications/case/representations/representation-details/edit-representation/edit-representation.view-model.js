/**
 *
 * @param {*} representationDetails
 * @param {string} caseId
 * @param {string} representationId
 * @param {string} title
 * @param {*} errors
 * @return {{pageHeading: string, backLink: string, pageTitle: string, projectName: string, representationText: string, representationDetails: *, errors: *}}
 */
export const getEditRepresentationViewModel = (
	representationDetails,
	caseId,
	representationId,
	title,
	errors
) => ({
	representationDetails,
	errors,
	backLink: `/applications-service/case/${caseId}/relevant-representations/${representationId}/representation-details`,
	pageTitle: 'Edit representation',
	pageHeading:
		`${representationDetails.represented.firstName || ''} ${
			representationDetails.represented.lastName || ''
		}`.trim() || representationDetails.represented.organisationName,
	projectName: title,
	representationText:
		errors?.editedRepresentation?.value ??
		(representationDetails.editedRepresentation || representationDetails.originalRepresentation)
});
