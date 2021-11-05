const DBError = require('./db-error');

describe('lib/db-error', () => {
  it('should return an object with the correct params', () => {
    const apiError = new DBError('Appeal not found');

    expect(apiError).toBeInstanceOf(Error);
    expect(apiError.name).toEqual('ApiError');
    expect(apiError.message).toEqual('Appeal not found');
    expect(apiError.errors).toEqual(['Appeal not found']);
  });
});
