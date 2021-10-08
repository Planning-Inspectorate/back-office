const toArray = require('./to-array');

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
