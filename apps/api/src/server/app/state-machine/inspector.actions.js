const inspectorActionsService = {
	sendEmailToAppellantWithSiteVisitBooking: async function(appealId) {
		await console.log(`Sending email to Appellant about booked site visit for appeal id ${appealId}`);
	},
	sendEmailToLPAAndAppellantWithDeciion: async function(appealId, decision) {
		await console.log(`Sending email to Appellant and LPA about decision for appeal id ${appealId} being ${decision}`);
	}
};

export default inspectorActionsService;
