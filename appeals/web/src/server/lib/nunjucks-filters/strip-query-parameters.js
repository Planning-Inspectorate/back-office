import config from '@pins/web/environment/config.js';

/**
 * Strip query params from URLs in dev only. Used for lazy cache-busting e.g. in
 * non-prod, app.css?blah => app.css
 *
 * @param {string} url
 * @returns {string=}
 */
export default (url) => {
	return config.isProduction ? url : url.split('?')[0];
};
