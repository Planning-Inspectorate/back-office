# Common

A package of common utilities that can be shared between all packages.

This should be required as a file dependency as will not be published to an
npm repository. To use it, add this line to your `package.json` `dependencies`
and run`npm install`.

```
"@pins/common": "file:../common",
```

## Docker

  

## Modules

Overview of available modules

### Health

This is the boilerplate for the health checks, which configures Terminus. This
will configure an endpoint on `/health` that can be called by Kubernetes etc.

The health checks take the form of an array. The function should return a simple
`Promise<boolean>` to indicate whether the resource is healthy or not. If an
error is thrown, this is treated the same way as if it returns `false`. 

```typescript
({
    server,
    tasks,
    logger,
    timeout = 1000,
    onTerminate = null,
    terminationGrace = 5000,
} : {
    server: any,
    tasks: { name: string, test: () => Promise<boolean> },
    logger,
    timeout: number,
    onTerminate: () => Promise<void> | null,
    terminationGrace: number,
}) => void {};
```


### Prometheus

This is a facade for the [prom-client](https://github.com/siimon/prom-client)
module. [Prometheus](https://prometheus.io/) is a monitoring system that takes
snapshots about the status and health of an application - snapshots can be taken
at different points in time to provide a picture about how the application
behaves over time.

By convention, Prometheus metrics are published at `/metrics`. This provides
a thin wrapper to the prom-client library and configures an endpoint at
`GET:/metrics` and dumps the system data.

At it's very basic level, you need to put the `prometheus.init` call as soon
after invoking `express()` as is possible. By default, the default system
metrics are published - **IMPORTANT** these should not be disabled unless for
a very good reason.

```js
const express = require('express');
const { prometheus } = require('@pins/common');

const app = express();

prometheus.init(app);

app.listen(3000);
```

#### Custom Metrics

To generate a custom metric, please follow the [documentation](https://github.com/siimon/prom-client#custom-metrics)
As well as the `init` function, the `prometheus` object also exposes the
`register` and the `promClient` endpoints which are needed to be used to add
a metric:

```js
const counter = new prometheus.promClient.Counter({
  name: 'metric_name',
  help: 'metric_help',
});

counter.inc(); // Increment by 1
counter.inc(10); // Increment by 10
```

The rest of the examples can be run in this manner.

---

### Utils

#### Promise Timeout

Add a timeout to a promise

```typescript
interface promiseTimeout {
  (timeoutValueInMS: number, promise: Promise) : Promise
}
```
