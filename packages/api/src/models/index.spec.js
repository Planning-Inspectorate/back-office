const db = require('./index');

describe('models/index', () => {
  it('should...', () => {
    expect(db).toHaveProperty('HASAppealSubmission');
    expect(db).toHaveProperty('sequelize');
    expect(db).toHaveProperty('Sequelize');
  });
});
