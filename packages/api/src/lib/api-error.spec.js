const ApiError = require('./api-error');

describe('lib/api-error', () => {
  it('should return an object with the correct params', () => {
    const apiError = new ApiError('Appeal not found');

    expect(apiError).toBeInstanceOf(Error);
    expect(apiError.name).toEqual('ApiError');
    expect(apiError.message).toEqual('Appeal not found');
    expect(apiError.errors).toEqual(['Appeal not found']);
  });
});
