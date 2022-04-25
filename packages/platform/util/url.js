import { UrlString } from '@azure/msal-common';

/**
 * Gets the absolute URL from a given request and path string
 *
 * @param {import('express').Request} request express request object
 * @param {string} url: a given URL
 * @returns {string}
 */
export function ensureAbsoluteUrl(request, url) {
	const urlComponents = new UrlString(url).getUrlComponents();

	if (!urlComponents.Protocol) {
		if (!urlComponents.HostNameAndPort && !url.startsWith('www')) {
			if (!url.startsWith('/')) {
				return request.protocol + '://' + request.get('host') + '/' + url;
			}
			return request.protocol + '://' + request.get('host') + url;
		}
		return request.protocol + '://' + url;
	} else {
		return url;
	}
}
