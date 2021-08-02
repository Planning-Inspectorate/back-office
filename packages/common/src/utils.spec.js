const util = require('./utils');

describe('Utils test', () => {
  describe('#promiseTimeout', () => {
    it('should resolve a promise that is settled within the timeout', async () => {
      const response = 'yay';
      const timeout = 10;

      const promise = async () => response;

      await expect(util.promiseTimeout(timeout, promise())).resolves.toEqual(response);
    });

    it('should reject a promise that is settled within the timeout', async () => {
      const err = new Error('some-error');
      const timeout = 10;

      const promise = async () => {
        throw err;
      };

      await expect(util.promiseTimeout(timeout, promise())).rejects.toEqual(err);
    });

    it('should reject a promise that exceeds the timeout', async () => {
      const timeout = 10;
      const promise = async () => {
        await new Promise((resolve) => setTimeout(resolve, timeout * 2)); // 1 ms more may not be enough for nextTick
        return 'hooray';
      };

      await expect(util.promiseTimeout(timeout, promise())).rejects.toEqual(new Error('timeout'));
    });
  });
});
