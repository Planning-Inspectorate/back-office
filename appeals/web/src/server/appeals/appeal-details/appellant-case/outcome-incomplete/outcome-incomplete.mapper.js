/**
 *
 * @param {string} appealId
 * @param {string} appealReference
 * @returns {ConfirmationPageContent}
 */
export function decisionIncompleteConfirmationPage(appealId, appealReference) {
	return {
		pageTitle: 'Appeal incomplete',
		panel: {
			title: 'Appeal incomplete',
			appealReference: {
				label: 'Appeal ID',
				reference: appealReference
			}
		},
		body: {
			preHeading: 'The appeal has been reviewed.',
			title: {
				text: 'What happens next'
			},
			rows: [
				{
					text: 'We’ve sent an email to the appellant and LPA to inform the case is incomplete, and let them know what to do next.'
				},
				{
					text: 'We also sent them a reminder about the appeal’s due date.'
				},
				{
					text: 'Go to case details',
					href: `/appeals-service/appeal-details/${appealId}`
				}
			]
		}
	};
}
