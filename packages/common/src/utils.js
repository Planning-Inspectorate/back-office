/**
 * Utility methods
 */

const toArray = (candidate) => {
  const array = [];
  if (candidate) {
    if (Array.isArray(candidate)) {
      array.push(...candidate);
    } else {
      array.push(candidate);
    }
  }
  return array;
};

module.exports = {
  toArray,
  /**
   * Promise Timeout
   *
   * Add a timeout to a promise.
   *
   * @param {number} timeoutValue
   * @param {Promise} promise
   * @return {Promise<any>}
   */
  promiseTimeout(timeoutValue, promise) {
    let timeoutId;
    return Promise.race([
      Promise.resolve().then(async () => {
        const result = await promise;

        /* istanbul ignore else */
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = undefined;
        }

        return result;
      }),
      new Promise((resolve, reject) => {
        timeoutId = setTimeout(() => {
          /* istanbul ignore next */
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = undefined;
          }

          reject(new Error('timeout'));
        }, timeoutValue);
      }),
    ]);
  },
};
