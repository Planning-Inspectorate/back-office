class ApiError extends Error {
  constructor(error) {
    super();
    this.name = 'ApiError';
    this.message = error;
    this.errors = [error];
  }
}

module.exports = ApiError;
