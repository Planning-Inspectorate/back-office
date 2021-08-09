const functional = require('./functional');

describe('functional', () => {
  describe('#flow', () => {
    it('should add the data to the start of the array and run the tasks in order', async () => {
      const input = 'some-input';
      const tasks = [
        (data) => {
          expect(data).toBe(input);
          return 1;
        },
        (item) => {
          expect(item).toBe(1);
          return 2;
        },
      ];

      expect(await functional.flow(tasks)(input)).toBe(2);
    });

    it('should add the data to the start of the array and run the tasks in order - promises', async () => {
      const input = 'some-input';
      const tasks = [
        async (data) => {
          await new Promise((resolve) => setTimeout(resolve, 10));

          expect(data).toBe(input);
          return 1;
        },
        async (item) => {
          await new Promise((resolve) => setTimeout(resolve, 10));

          expect(item).toBe(1);
          return 2;
        },
      ];

      expect(await functional.flow(tasks)(input)).toBe(2);
    });
  });
});
