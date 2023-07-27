/**
 *
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {string} appealShortReference
 * @param {number} appealId
 */
export const renderDecisionValidConfirmationPage = async (
	response,
	appealShortReference,
	appealId
) => {
	response.render('app/confirmation.njk', {
		panel: {
			title: 'Appeal valid',
			appealReference: {
				label: 'Appeal ID',
				reference: appealShortReference
			}
		},
		body: {
			preTitle: 'The timetable is now created and published.',
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
	});
};
