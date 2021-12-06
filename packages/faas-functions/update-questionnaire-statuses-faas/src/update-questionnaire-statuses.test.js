jest.mock('./update-questionnaire-statuses');
const updateQuestionnaireStatuses = require('./update-questionnaire-statuses');

describe('update-questionnaire-statuses', () => {
  let mockEvent;
  let mockHttpStatus;

  beforeEach(() => {
    mockEvent = { body: {} };
    mockHttpStatus = { httpStatus: 200 };
  });

  it('should call updateQuestionnaireStatuses', async () => {
    updateQuestionnaireStatuses.mockImplementation();
    await updateQuestionnaireStatuses(mockEvent, mockHttpStatus);
    expect(updateQuestionnaireStatuses).toHaveBeenCalled();
  });
});
