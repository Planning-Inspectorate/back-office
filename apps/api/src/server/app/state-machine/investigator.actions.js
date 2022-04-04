const investigatorActionsService = {
	sendEmailToAppellantWithSiteVisitBooking: async function(_context, _event) {
		await console.log('Sending email to Appellant about booked site visit');
	}
};

export default investigatorActionsService;
