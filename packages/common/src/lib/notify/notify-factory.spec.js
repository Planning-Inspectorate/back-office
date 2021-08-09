const { NotifyClient } = require('notifications-node-client');
const { createNotifyClient, getNotifyClientArguments } = require('./notify-factory');
const config = require('../../config');

jest.mock('../../config');

describe('lib/notify/notify-factory', () => {
  let baseUrl;
  let serviceId;
  let apiKey;

  beforeEach(() => {
    baseUrl = 'http://mock-notify:3000';
    serviceId = 'dummy-service-id-for-notify';
    apiKey = 'dummy-api-key-for-notify';
  });

  describe('getNotifyClientArguments', () => {
    describe('Using mock service ', () => {
      test('if `baseUrl` is provided then push `baseUrl` and `serviceId`', () => {
        expect(getNotifyClientArguments(baseUrl, serviceId, apiKey)).toEqual([
          baseUrl,
          serviceId,
          apiKey,
        ]);
      });

      test('throws if `serviceId` is undefined', () => {
        expect(() => getNotifyClientArguments(baseUrl, undefined, apiKey)).toThrow(
          'If baseUrl is provided, serviceId must be provided also.'
        );
      });
    });

    [
      { baseUrl: null, serviceId: null },
      { baseUrl: undefined, serviceId: undefined },
      { baseUrl: undefined, serviceId },
    ].forEach(({ baseUrl: burl, serviceId: sid }) => {
      test('Using real service', () => {
        expect(getNotifyClientArguments(burl, sid, apiKey)).toEqual([apiKey]);
      });
    });
  });

  describe('createNotifyClient', () => {
    test('can explicitly specify config', () => {
      expect(
        createNotifyClient({
          baseUrl,
          serviceId,
          apiKey,
        })
      ).toEqual(new NotifyClient(...getNotifyClientArguments(baseUrl, serviceId, apiKey)));
    });

    test('works without overriding the config', () => {
      const { baseUrl: url, serviceId: sid, apiKey: key } = config.services.notify;
      expect(createNotifyClient()).toEqual(
        new NotifyClient(...getNotifyClientArguments(url, sid, key))
      );
    });

    test('allow override of base url', () => {
      const override = 'overidden value here 1';
      const { serviceId: sid, apiKey: key } = config.services.notify;
      expect(createNotifyClient({ baseUrl: override, serviceId: sid })).toEqual(
        new NotifyClient(...getNotifyClientArguments(override, sid, key))
      );
    });

    test('allow override of serviceId', () => {
      const override = 'overidden value here 2';
      const { baseUrl: url, apiKey: key } = config.services.notify;
      expect(createNotifyClient({ serviceId: override })).toEqual(
        new NotifyClient(...getNotifyClientArguments(url, override, key))
      );
    });

    test('allow override of apiKey', () => {
      const override = 'overidden value here 3';
      const { baseUrl: url, serviceId: sid } = config.services.notify;
      expect(createNotifyClient({ apiKey: override })).toEqual(
        new NotifyClient(...getNotifyClientArguments(url, sid, override))
      );
    });
  });
});
