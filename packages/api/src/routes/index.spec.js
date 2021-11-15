const appeal = require('./appeal');
const appealLink = require('./appeal-link');
const appealSubmission = require('./appeal-submission');
const questionnaire = require('./questionnaire');
const apiDocsRouter = require('./api-docs');
const { mockUse } = require('../../test/utils/mocks');

describe('routes/index', () => {
  it('should define the expected routes', () => {
    // eslint-disable-next-line global-require
    require('./index');

    expect(mockUse).toHaveBeenCalledWith('/api/v1/appeal', appeal);
    expect(mockUse).toHaveBeenCalledWith('/api/v1/appeal-link', appealLink);
    expect(mockUse).toHaveBeenCalledWith('/api/v1/appeal-submission', appealSubmission);
    expect(mockUse).toHaveBeenCalledWith('/api/v1/questionnaire', questionnaire);
    expect(mockUse).toHaveBeenCalledWith('/api-docs', apiDocsRouter);
  });
});
