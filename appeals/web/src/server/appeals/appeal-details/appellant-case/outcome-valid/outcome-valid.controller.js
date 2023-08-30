import { objectContainsAllKeys } from '#lib/object-utilities.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
const renderDecisionValidConfirmationPage = async (request, response) => {
	if (!objectContainsAllKeys(request.session, ['appealId', 'appealReference'])) {
		return response.render('app/500.njk');
	}

	const { appealId, appealReference } = request.session;

	response.render('app/confirmation.njk', {
		panel: {
			title: 'Appeal valid',
			appealReference: {
				label: 'Appeal ID',
				reference: appealReference
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

/** @type {import('@pins/express').RequestHandler<Response>}  */
export const getConfirmation = async (request, response) => {
	renderDecisionValidConfirmationPage(request, response);
};
