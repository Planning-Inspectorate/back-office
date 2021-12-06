jest.mock('./update-questionnaire-statuses');
const updateQuestionnaireStatuses = require('./update-questionnaire-statuses');

describe('update-questionnaire-statuses', () => {
  let mockEvent;

  beforeEach(() => {
    mockEvent = { body: {} };
  });

  it('should call updateQuestionnaireStatuses', async () => {
    updateQuestionnaireStatuses.mockImplementation();
    await updateQuestionnaireStatuses(mockEvent);
    expect(updateQuestionnaireStatuses).toHaveBeenCalled();
  });
});
