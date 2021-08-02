jest.mock('prom-client');

const promClient = require('prom-client');
const prometheus = require('./prometheus');

describe('prometheus', () => {
  const oldEnv = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...oldEnv };
  });

  afterEach(() => {
    process.env = oldEnv;
  });

  it('should expose the services', () => {
    /* Use "sort" as order of keys not important */
    expect(Object.keys(prometheus).sort()).toEqual(
      ['init', 'metrics', 'promClient', 'register'].sort()
    );

    /* Use the global registry */
    expect(prometheus.register).toBe(promClient.register);
    expect(prometheus.promClient).toBe(promClient);
  });

  describe('#init', () => {
    let app;
    let res;
    beforeEach(() => {
      promClient.collectDefaultMetrics.mockClear();

      app = {
        get: jest.fn(),
        use: jest.fn(),
      };
      app.get.mockReturnValue(app);

      res = {
        setHeader: jest.fn(),
        send: jest.fn(),
      };
    });

    describe('/metrics', () => {
      it('should configure the /metrics endpoint with default settings', async () => {
        process.env.APP_NAME = 'my-app';
        process.env.BUILD_ID = 'build-id';
        process.env.VERSION = 'version';
        promClient.register.metrics.mockResolvedValue('data');

        expect(prometheus.init(app)).toBe(app);

        expect(promClient.register.setDefaultLabels).toBeCalledWith({
          service: 'my-app',
          buildId: 'build-id',
          version: 'version',
        });

        expect(promClient.collectDefaultMetrics).toBeCalledWith({
          register: prometheus.register,
        });

        expect(app.get.mock.calls[0][0]).toBe('/metrics');
        expect(await app.get.mock.calls[0][1](undefined, res)).toBe(undefined);

        expect(res.setHeader).toBeCalledWith('content-type', 'text/plain');
        expect(res.send).toBeCalledWith('data');
      });

      it('should configure the /metrics endpoint with configured settings', async () => {
        process.env.APP_NAME = 'my-app2';
        promClient.register.metrics.mockResolvedValue('data2');

        expect(
          prometheus.init(app, {
            defaultLabels: {
              hello: 'world',
            },
            collectDefault: false,
          })
        ).toBe(app);

        expect(promClient.register.setDefaultLabels).toBeCalledWith({
          service: 'my-app2',
          hello: 'world',
        });

        expect(promClient.collectDefaultMetrics).not.toBeCalled();

        expect(app.get.mock.calls[0][0]).toBe('/metrics');
        expect(await app.get.mock.calls[0][1](undefined, res)).toBe(undefined);

        expect(res.setHeader).toBeCalledWith('content-type', 'text/plain');
        expect(res.send).toBeCalledWith('data2');
      });
    });

    describe('#middleware', () => {
      it('should register a new request and time the call', () => {
        expect(
          prometheus.init(app, {
            defaultLabels: {
              hello: 'world',
            },
          })
        ).toBe(app);

        const endTimer = jest.fn();

        prometheus.metrics.requestTimes.startTimer.mockReturnValue(endTimer);

        const oldSend = res.send;

        const next = jest.fn();

        expect(app.use.mock.calls[0][0](undefined, res, next)).toBe(undefined);

        const args = ['item1', 'item2'];

        /* Check the send is intercepted */
        expect(oldSend).not.toBe(res.send);
        expect(res.send(...args)).toBe(undefined);
        expect(oldSend).toBeCalledWith(...args);
        expect(endTimer).toBeCalledWith();
      });
    });
  });
});
