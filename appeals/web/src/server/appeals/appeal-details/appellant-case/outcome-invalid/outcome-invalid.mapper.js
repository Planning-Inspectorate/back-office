/**
 *
 * @param {string} appealId
 * @param {string} appealReference
 * @returns {ConfirmationPageContent}
 */
export function decisionInvalidConfirmationPage(appealId, appealReference) {
	return {
		pageTitle: 'Appeal invalid',
		panel: {
			title: 'Appeal invalid',
			appealReference: {
				label: 'Appeal ID',
				reference: appealReference
			}
		},
		body: {
			preHeading: 'The appeal has been closed.',
			title: {
				text: 'What happens next'
			},
			rows: [
				{
					text: "We've sent an email to the appellant and LPA to inform them the case is invalid."
				},
				{
					text: 'Go to case details',
					href: `/appeals-service/appeal-details/${appealId}`
				}
			]
		}
	};
}
