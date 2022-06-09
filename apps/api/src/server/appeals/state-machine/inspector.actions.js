import logger from '../../lib/logger.js';

const inspectorActionsService = {
	async sendEmailToAppellantWithSiteVisitBooking(appealId) {
		await logger.info(`Sending email to Appellant about booked site visit for appeal id ${appealId}`);
	},
	async sendEmailToLPAAndAppellantWithDeciion(appealId, decision) {
		await logger.info(
			`Sending email to Appellant and LPA about decision for appeal id ${appealId} being ${decision}`
		);
	}
};

export default inspectorActionsService;
