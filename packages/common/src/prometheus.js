const promClient = require('prom-client');

const { register } = promClient;

const metrics = {
  incomingRequests: new promClient.Counter({
    name: 'incoming_request',
    help: 'Counts number of requests received',
  }),
  requestTimes: new promClient.Histogram({
    name: 'request_times',
    help: 'Time ',
  }),
};

const init = (app, { defaultLabels = {}, collectDefault = true } = {}) => {
  register.setDefaultLabels({
    ...defaultLabels,
    service: process.env.APP_NAME,
    buildId: process.env.BUILD_ID,
    version: process.env.VERSION,
  });

  if (collectDefault) {
    promClient.collectDefaultMetrics({
      register,
    });
  }

  app
    .get('/metrics', async (req, res) => {
      res.setHeader('content-type', 'text/plain');
      res.send(await register.metrics());
    })
    /* Put after metrics to not skew the numbers */
    .use((req, res, next) => {
      const end = metrics.requestTimes.startTimer();
      metrics.incomingRequests.inc();

      /* Intercept the send method to put in call time */
      const oldSend = res.send;
      res.send = function interceptedSend(...args) {
        end();

        oldSend.apply(res, args);
      };

      next();
    });

  return app;
};

module.exports = {
  init,
  metrics,
  promClient,
  register,
};
