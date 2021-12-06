const govUkErrorListOnlyFirst = require('./govuk-error-list-only-first');

describe('lib/govuk-error-list-only-first', () => {
  let req = { body: {} };
  const res = {};
  const next = jest.fn();

  beforeEach(() => {
    req = { body: {} };
  });

  it('should keep only first item in errorSummary array', () => {
    req.body.errorSummary = [
      {
        text: 'errorSummary-1',
        href: '#href-1',
      },
      {
        text: 'errorSummary-2',
        href: '#href-2',
      },
    ];
    govUkErrorListOnlyFirst(req, res, next);

    expect(next).toBeCalledTimes(1);
    expect(req.body.errorSummary).toHaveLength(1);
    expect(req.body.errorSummary[0].text).toEqual('errorSummary-1');
    expect(req.body.errorSummary[0].href).toEqual('#href-1');

    req.body.errorSummary = [
      {
        text: 'errorSummary-1',
        href: '#href-1',
      },
    ];
    govUkErrorListOnlyFirst(req, res, next);

    expect(next).toBeCalledTimes(2);
    expect(req.body.errorSummary).toHaveLength(1);
    expect(req.body.errorSummary[0].text).toEqual('errorSummary-1');
    expect(req.body.errorSummary[0].href).toEqual('#href-1');
  });
});
