const questionnairesList = require('../controllers/questionnaires-list');
const views = require('../config/views');
const { mockGet } = require('../../test/utils/mocks');

describe('routes/questionnaires-list', () => {
  it('should define the correct route', () => {
    // eslint-disable-next-line global-require
    require('./questionnaires-list');
    expect(mockGet).toBeCalledWith(`/${views.questionnairesList}`, questionnairesList);
  });
});
