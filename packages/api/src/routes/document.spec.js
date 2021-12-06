const { postDocument } = require('../controllers/document');
const { mockPost } = require('../../test/utils/mocks');

describe('routes/document', () => {
  it('should define the expected routes', () => {
    // eslint-disable-next-line global-require
    require('./document');

    expect(mockPost).toHaveBeenCalledWith('/:appealOrQuestionnaireId', postDocument);
  });
});
