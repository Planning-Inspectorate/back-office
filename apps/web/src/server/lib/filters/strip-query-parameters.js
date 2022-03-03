'use strict';

const { config } = require('../../config/config');

const noop = (url) => url;
const strip = (url) => url.split('?')[0];

// Strip query params from URLs in dev only. Used for lazy cache-busting
// e.g. in non-prod, app.css?blah => app.css
module.exports = config.isProd ? noop : strip;
