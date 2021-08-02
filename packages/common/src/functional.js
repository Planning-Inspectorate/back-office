/**
 * functional
 *
 * Functional programming helper functions
 */

module.exports = {
  /**
   * Flow
   *
   * Creates a function that returns a promise resolving the
   * result of all the function tasks passed in
   *
   * @param tasks
   * @returns {function(*): *}
   */
  flow: (tasks) => (data) => {
    /* Begin by inserting the data to the flow */
    tasks.unshift(() => data);
    return tasks.reduce((thenable, fn) => thenable.then((value) => fn(value)), Promise.resolve());
  },
};
