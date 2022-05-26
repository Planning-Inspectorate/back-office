const inspectorActionsService = {
	async sendEmailToAppellantWithSiteVisitBooking(appealId) {
		await console.log(`Sending email to Appellant about booked site visit for appeal id ${appealId}`);
	},
	async sendEmailToLPAAndAppellantWithDeciion(appealId, decision) {
		await console.log(`Sending email to Appellant and LPA about decision for appeal id ${appealId} being ${decision}`);
	}
};

export default inspectorActionsService;
