const validateCheckboxValueAgainstOptions = require('./validate-checkbox-against-options');

const validOptions = ['valid-1', 'valid-2', 'valid-3'];

describe('validation/utils/validate-checkbox-against-options.js', () => {
  describe('validateCheckboxValueAgainstOptions', () => {
    it('should return true with undefined value', () => {
      const result = validateCheckboxValueAgainstOptions(undefined, validOptions);
      expect(result).toBe(true);
    });

    it('should return true if value is a valid option', () => {
      const result = validateCheckboxValueAgainstOptions('valid-1', validOptions);
      expect(result).toBe(true);
    });

    it('should return true if all members of value array are a valid option', () => {
      const result = validateCheckboxValueAgainstOptions(['valid-1', 'valid-2'], validOptions);
      expect(result).toBe(true);
    });

    it('should throw error if a member of value array is a not a valid option', () => {
      expect(() =>
        validateCheckboxValueAgainstOptions(['valid-1', 'vali-2'], validOptions)
      ).toThrow('Invalid option(s) received');
    });
  });
});
