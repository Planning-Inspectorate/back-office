/**
 *
 * @param {import('got').Got} apiClient
 * @param {*} appealId
 * @param {import('@pins/appeals.api').Appeals.AppealSite} neighbouringSite
 * @returns {Promise<{}>}
 */
export function addNeighbouringSite(apiClient, appealId, neighbouringSite) {
	console.log(neighbouringSite);
	const formattedNeighbouringSite = {
		addressLine1: neighbouringSite.addressLine1,
		...(neighbouringSite.addressLine2 && { addressLine2: neighbouringSite.addressLine2 }),
		...(neighbouringSite.county && { county: neighbouringSite.county }),
		postcode: neighbouringSite.postCode,
		town: neighbouringSite.town
	};
	return apiClient.post(`appeals/${appealId}/neighbouring-sites`, {
		json: {
			...formattedNeighbouringSite
		}
	});
}
