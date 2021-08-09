const { NotifyClient } = require('notifications-node-client');
const config = require('../../config');

function getNotifyClientArguments(baseUrl, serviceId, apiKey) {
  const args = [];
  if (baseUrl) {
    if (!serviceId) {
      throw new Error('If baseUrl is provided, serviceId must be provided also.');
    }
    args.push(baseUrl, serviceId);
  }
  args.push(apiKey);
  return args;
}

function createNotifyClient({ baseUrl, serviceId, apiKey } = config.services.notify) {
  const activeBaseUrl = baseUrl || config.services.notify.baseUrl;
  const activeServiceId = serviceId || config.services.notify.serviceId;
  const activeApiKey = apiKey || config.services.notify.apiKey;

  return new NotifyClient(
    ...getNotifyClientArguments(activeBaseUrl, activeServiceId, activeApiKey)
  );
}

module.exports = {
  createNotifyClient,
  getNotifyClientArguments,
};
