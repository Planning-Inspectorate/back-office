/**
 * Health
 *
 * Create an endpoint on /health to check all dependent
 * resources
 */

const { createTerminus, HealthCheckError } = require('@godaddy/terminus');

const prometheus = require('./prometheus');
const { promiseTimeout } = require('./utils');

module.exports = ({
  server,
  tasks = [],
  logger,
  timeout = 1000,
  onTerminate = null,
  terminationGrace = 0,
}) => {
  /* Add a prometheus gauge to the health check */
  const promHelp = 'Health status - 1 healthy, 0 unhealthy';
  const healthGauge = new prometheus.promClient.Gauge({
    name: 'application_health',
    help: promHelp,
  });

  const checks = tasks.map((task) => ({
    ...task,
    gauge: new prometheus.promClient.Gauge({
      name: `${task.name}_health`,
      help: promHelp,
    }),
  }));

  return createTerminus(server, {
    signal: 'SIGINT',
    async beforeShutdown() {
      if (terminationGrace > 0) {
        logger.info({ terminationGrace }, 'Pausing before shutdown');

        await new Promise((resolve) => setTimeout(resolve, terminationGrace));
      }
    },
    healthChecks: {
      '/health': async () => {
        const startTime = Date.now();

        const results = (
          await Promise.allSettled(
            checks.map(async (task) => {
              let isHealthy = false;

              try {
                isHealthy = await promiseTimeout(timeout, task.test());
              } catch (err) {
                logger.debug({ err, task }, 'Health check failed');
              }

              task.gauge.set(isHealthy ? 1 : 0);

              return {
                ...task,
                isHealthy,
              };
            })
          )
        )
          .map(({ value }) => value)
          .map(({ isHealthy, name }) => ({
            isHealthy,
            name,
          }));

        const isHealthy = results.every(({ isHealthy: healthy }) => healthy);

        logger.debug({ isHealthy, elapsedTime: Date.now() - startTime }, 'Health check completed');

        if (!isHealthy) {
          healthGauge.set(0);
          throw new HealthCheckError('failed', results);
        }

        healthGauge.set(1);

        return results;
      },
    },
    logger(msg, err) {
      logger.error({ err }, msg);
    },
    async onSignal() {
      if (onTerminate) {
        await onTerminate();
      }

      logger.fatal('Server going down');
    },
  });
};
