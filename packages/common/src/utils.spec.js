const util = require('./utils');
const { toArray } = require('./utils');

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

  describe('#toArray', () => {
    it('should return empty array with undefined candidate', () => {
      const result = toArray(undefined);
      expect(Array.isArray(result)).toBeTruthy();
      expect(result.length).toEqual(0);
    });

    it('should return array if candidate is not array', () => {
      const result = toArray(1);
      expect(Array.isArray(result)).toBeTruthy();
      expect(result).toEqual([1]);
    });

    it('should return array if candidate is array', () => {
      const result = toArray([1, 2]);
      expect(Array.isArray(result)).toBeTruthy();
      expect(result).toEqual([1, 2]);
    });
  });
});
