/* istanbul ignore next */
exports.testExpressValidatorMiddleware = (req, res, middlewares) =>
  Promise.all(
    middlewares.map((middleware) => {
      const middlewareFn = Array.isArray(middleware) ? middleware[0] : middleware;

      return middlewareFn(req, res, () => undefined);
    })
  );
