class DBError extends Error {
  constructor(error) {
    super();
    this.name = 'DBError';
    this.message = error;
    this.errors = [error];
  }
}

module.exports = DBError;
