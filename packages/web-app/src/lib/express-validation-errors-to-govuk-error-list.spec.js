const { validationResult } = require('express-validator');
const expressValidationErrorsToGovUkErrorList = require('./express-validation-errors-to-govuk-error-list');

jest.mock('express-validator', () => ({
  validationResult: jest
    .fn()
    .mockReturnValueOnce({
      isEmpty: () => false,
      mapped: () => ({
        'review-outcome': {
          value: undefined,
          msg: 'Select if the appeal is valid or invalid, or if something is missing or wrong',
          param: 'review-outcome',
          location: 'body',
        },
      }),
      errors: [
        {
          value: undefined,
          msg: 'Select if the appeal is valid or invalid, or if something is missing or wrong',
          param: 'review-outcome',
          location: 'body',
        },
      ],
    })
    .mockReturnValueOnce({
      isEmpty: () => true,
      mapped: jest.fn(),
      errors: [],
    }),
}));

describe('lib/express-validation-errors-to-govuk-error-list', () => {
  let req = { body: {} };
  const res = {};
  const next = jest.fn();

  beforeEach(() => {
    req = { body: {} };
  });

  it('should set req.body.errors and req.body.errorSummary when there are errors', () => {
    expressValidationErrorsToGovUkErrorList(req, res, next);

    expect(validationResult).toBeCalledTimes(1);
    expect(validationResult).toBeCalledWith(req);
    expect(next).toBeCalledTimes(1);

    expect(req.body.errors).toEqual({
      'review-outcome': {
        value: undefined,
        msg: 'Select if the appeal is valid or invalid, or if something is missing or wrong',
        param: 'review-outcome',
        location: 'body',
      },
    });
    expect(req.body.errorSummary).toEqual([
      {
        text: 'Select if the appeal is valid or invalid, or if something is missing or wrong',
        href: '#review-outcome',
      },
    ]);
  });

  it('should not set req.body.errors and req.body.errorSummary when there are no errors', () => {
    expressValidationErrorsToGovUkErrorList(req, res, next);

    expect(validationResult).toBeCalledTimes(1);
    expect(validationResult).toBeCalledWith(req);
    expect(next).toBeCalledTimes(1);

    expect(req.body.errors).toBeUndefined();
    expect(req.body.errorSummary).toBeUndefined();
  });
});
