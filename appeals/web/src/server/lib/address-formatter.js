import { join, map, pick } from 'lodash-es';

/**
 * converts a multi part address to a single string
 *
 * @param {import('@pins/appeals').Address} address
 * @returns {string}
 */
export const addressToString = (address) => {
	return join(
		map(pick(address, ['addressLine1', 'addressLine2', 'town', 'county', 'postCode']), (value) => {
			return value?.trim();
		}).filter((value) => value?.length),
		', '
	);
};

/**
 * @param {import('@pins/appeals.api').Appeals.AppealSite} appealSite
 * @returns {import('@pins/appeals').Address}
 */
export const appealSiteToAddress = (appealSite) => {
	return {
		addressLine1: appealSite.addressLine1 || '',
		addressLine2: appealSite.addressLine2 || '',
		town: appealSite.town || '',
		county: appealSite.county || '',
		postCode: appealSite.postCode || ''
	};
};

/**
 * @param {import('@pins/appeals.api').Appeals.AppealSite} appealSite
 * @returns {string}
 */
export const appealSiteToAddressString = (appealSite) => {
	return addressToString(appealSiteToAddress(appealSite));
};
