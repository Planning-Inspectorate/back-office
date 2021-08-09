/**
 * Config
 *
 * This is the single-source-of-truth for the application. All
 * config should be driven by environment variables where different
 * values are required
 */

module.exports = {
  logger: {
    level: process.env.LOGGER_LEVEL || 'info',
    redact: ['config.services.notify.apiKey'],
  },
  services: {
    notify: {
      baseUrl: process.env.SRV_NOTIFY_BASE_URL,
      serviceId: process.env.SRV_NOTIFY_SERVICE_ID,
      apiKey: process.env.SRV_NOTIFY_API_KEY,
    },
  },
};
