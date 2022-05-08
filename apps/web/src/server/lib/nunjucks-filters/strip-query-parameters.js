import config from '@pins/web/environment/config.js';
import { noop } from 'lodash-es';

/**
 * @param {string} url
 * @returns {string=}
 */
const strip = (url) => url.split('?')[0];

// Strip query params from URLs in dev only. Used for lazy cache-busting
// e.g. in non-prod, app.css?blah => app.css
export default config.isProd ? noop : strip;
