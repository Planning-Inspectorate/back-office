/**
 *
 * @param {string} appealId
 * @param {string} appealReference
 * @returns {ConfirmationPageContent}
 */
export function decisionValidConfirmationPage(appealId, appealReference) {
	return {
		pageTitle: 'Appeal valid',
		panel: {
			title: 'Appeal valid',
			appealReference: {
				label: 'Appeal ID',
				reference: appealReference
			}
		},
		body: {
			preHeading: 'The timetable is now created and published.',
			title: {
				text: 'What happens next'
			},
			rows: [
				{
					text: "We've sent the start letter email to the Appellant and LPA."
				},
				{
					text: 'The case has been published on the Appeals Casework Portal.'
				},
				{
					text: 'Go to case details',
					href: `/appeals-service/appeal-details/${appealId}`
				}
			]
		}
	};
}
