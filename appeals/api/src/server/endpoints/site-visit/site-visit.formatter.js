/** @typedef {import('@pins/appeals.api').Appeals.RepositoryGetByIdResultItem} RepositoryGetByIdResultItem */
/** @typedef {import('@pins/appeals.api').Appeals.SingleSiteVisitDetailsResponse} SingleSiteVisitDetailsResponse */

const siteVisitFormatter = {
	/**
	 * @param {RepositoryGetByIdResultItem} appeal
	 * @returns {SingleSiteVisitDetailsResponse | void}}
	 */
	formatSiteVisit(appeal) {
		const { siteVisit } = appeal;

		if (siteVisit) {
			return {
				appealId: siteVisit.appealId,
				visitDate: siteVisit.visitDate,
				siteVisitId: siteVisit.id,
				visitEndTime: siteVisit.visitEndTime,
				visitStartTime: siteVisit.visitStartTime,
				visitType: siteVisit.siteVisitType.name
			};
		}
	}
};

export default siteVisitFormatter;
