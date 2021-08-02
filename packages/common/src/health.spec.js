jest.mock('@godaddy/terminus/lib/terminus');
jest.mock('./prometheus');

const { createTerminus, HealthCheckError } = require('@godaddy/terminus');
const health = require('./health');

function mocks(config = {}) {
  const opts = {
    ...config,
    server: 'server',
    logger: {
      debug: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      fatal: jest.fn(),
    },
  };

  health(opts);

  const args = createTerminus.mock.calls[0];

  expect(args[0]).toEqual(opts.server);

  return {
    opts,
    args: args[1],
  };
}

describe('health check configuration', () => {
  beforeEach(() => {
    createTerminus.mockClear();
  });

  describe('#beforeShutdown', () => {
    it('should do nothing if no terminationGrace set', async () => {
      const { args } = mocks();

      await args.beforeShutdown();
    });

    it('should do nothing if no terminationGrace set to 0', async () => {
      const { args } = mocks({
        terminationGrace: 0,
      });

      await args.beforeShutdown();
    });

    it('should apply a termination grace if specified', async () => {
      const terminationGrace = 100;
      const startTime = Date.now();
      const { args } = mocks({
        terminationGrace,
      });

      await args.beforeShutdown();

      expect(Date.now() - startTime).toBeGreaterThanOrEqual(terminationGrace);
    });
  });

  describe('#healthChecks', () => {
    it('should define a health check endpoint with no check', async () => {
      // Even though tasks are required, may have dynamic checks that aren't specified
      const { args } = mocks({
        tasks: [],
      });

      expect(await args.healthChecks['/health']()).toEqual([]);
    });

    it('should define a health check endpoint and simulate a healthy system', async () => {
      const tasks = [
        {
          name: 'passing test',
          test: async () => true,
        },
      ];

      const { args } = mocks({
        tasks,
      });

      expect(await args.healthChecks['/health']()).toEqual([
        {
          name: 'passing test',
          isHealthy: true,
        },
      ]);
    });

    it('should define a health check endpoint and simulate an unhealthy system', async () => {
      const tasks = [
        {
          name: 'passing test',
          test: async () => true,
        },
        {
          name: 'failing test',
          test: async () => false,
        },
      ];

      const { args } = mocks({
        tasks,
      });

      await expect(args.healthChecks['/health']()).rejects.toEqual(
        new HealthCheckError('failed', [
          {
            name: 'passing test',
            isHealthy: true,
          },
          {
            name: 'failing test',
            isHealthy: false,
          },
        ])
      );
    });

    it('should define a health check endpoint and simulate a thrown error', async () => {
      const timeout = 100;
      const tasks = [
        {
          name: 'passing test',
          test: async () => true,
        },
        {
          name: 'thrown test',
          test: async () => {
            throw new Error('some-error');
          },
        },
      ];

      const { args } = mocks({
        tasks,
        timeout,
      });

      await expect(args.healthChecks['/health']()).rejects.toEqual(
        new HealthCheckError('failed', [
          {
            name: 'passing test',
            isHealthy: true,
          },
          {
            name: 'thrown test',
            isHealthy: false,
          },
        ])
      );
    });

    it('should define a health check endpoint and simulate an unhealthy system with a timeout', async () => {
      const timeout = 100;
      const tasks = [
        {
          name: 'passing test',
          test: async () => true,
        },
        {
          name: 'timedout test',
          test: async () => {
            /* Test still "passes", but we're checking the timeout errors */
            await new Promise((resolve) => setTimeout(resolve, timeout + 1));

            return true;
          },
        },
      ];

      const { args } = mocks({
        tasks,
        timeout,
      });

      await expect(args.healthChecks['/health']()).rejects.toEqual(
        new HealthCheckError('failed', [
          {
            name: 'passing test',
            isHealthy: true,
          },
          {
            name: 'timedout test',
            isHealthy: false,
          },
        ])
      );
    });
  });

  describe('#logger', () => {
    it('should return the logger method', () => {
      const { args, opts } = mocks();
      const msg = 'msg';
      const err = 'err';

      args.logger(msg, err);

      expect(opts.logger.error).toBeCalledWith({ err }, msg);
    });
  });

  describe('#onSignal', () => {
    it('should not call the onTerminate method if not set', async () => {
      const { args } = mocks();

      await args.onSignal();
    });

    it('should call the onTerminate method if set', async () => {
      const onTerminate = jest.fn();

      const { args } = mocks({
        onTerminate,
      });

      await args.onSignal();

      expect(onTerminate).toBeCalledWith();
    });
  });
});
