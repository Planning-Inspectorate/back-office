const { capitalize } = require('./string-functions');

describe('string-functions', () => {
  describe('capitalize', () => {
    it(`returns a capitalised string`, () => {
      expect(capitalize('mock value')).toEqual('Mock value');
    });
    it(`returns an empty string if something other than a string is passed`, () => {
      expect(capitalize(['mock value'])).toEqual('');
      expect(capitalize(12345)).toEqual('');
    });
  });
});
