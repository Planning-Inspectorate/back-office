const { validationResult } = require('express-validator');
const { testExpressValidatorMiddleware } = require('./validation-middleware-helper');
const { rules } = require('./review-questionnaire-submission');

const getFailedTextBoxAreaValidationTest = (data) => ({
  title: `lpaqreview-${data.title}-textarea - fail`,
  given: () => ({
    body: {
      [`lpaqreview-${data.title}-checkbox`]: 'on',
      [`lpaqreview-${data.title}-textarea`]: '',
    },
  }),
  expected: (result) => {
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].location).toEqual('body');
    expect(result.errors[0].msg).toEqual(data.errorMessage);
    expect(result.errors[0].param).toEqual(`lpaqreview-${data.title}-textarea`);
    expect(result.errors[0].value).toEqual('');
  },
});

const getSuccessfulTextBoxAreaValidationTest = (data) => ({
  title: `lpaqreview-${data.title}-textarea - success`,
  given: () => ({
    body: {
      [`lpaqreview-${data.title}-checkbox`]: 'on',
      [`lpaqreview-${data.title}-textarea`]: 'mock-test-area-text',
    },
  }),
  expected: (result) => {
    expect(result.errors).toHaveLength(0);
  },
});

const getFailedSubCheckboxBoxAreaValidationTest = (data) => ({
  title: `lpaqreview-${data.title}-notification-subcheckbox1 - fail`,
  given: () => ({
    body: {
      [`lpaqreview-${data.title}-notification-checkbox`]: 'on',
      [`lpaqreview-${data.title}-notification-subcheckbox1`]: undefined,
      [`lpaqreview-${data.title}-notification-subcheckbox2`]: undefined,
    },
  }),
  expected: (result) => {
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].location).toEqual('body');
    expect(result.errors[0].msg).toEqual(
      `Select which ${data.title} notification is missing or incorrect`
    );
    expect(result.errors[0].param).toEqual(`lpaqreview-${data.title}-notification-subcheckbox1`);
    expect(result.errors[0].value).toEqual(undefined);
  },
});

const getSuccessfulSubCheckboxBoxAreaValidationTestV1 = (data) => ({
  title: `lpaqreview-${data.title}-notification-checkbox - success`,
  given: () => ({
    body: {
      [`lpaqreview-${data.title}-notification-checkbox`]: 'on',
      [`lpaqreview-${data.title}-notification-subcheckbox1`]: 'on',
      [`lpaqreview-${data.title}-notification-subcheckbox2`]: undefined,
    },
  }),
  expected: (result) => {
    expect(result.errors).toHaveLength(0);
  },
});

const getSuccessfulSubCheckboxBoxAreaValidationTestV2 = (data) => ({
  title: `lpaqreview-${data.title}-notification-checkbox - success`,
  given: () => ({
    body: {
      [`lpaqreview-${data.title}-notification-checkbox`]: 'on',
      [`lpaqreview-${data.title}-notification-subcheckbox1`]: 'on',
      [`lpaqreview-${data.title}-notification-subcheckbox2`]: 'on',
    },
  }),
  expected: (result) => {
    expect(result.errors).toHaveLength(0);
  },
});

const runTest = (title, given, expected) => {
  it(`should return the expected validation outcome - ${title}`, async () => {
    const mockReq = given();
    const mockRes = jest.fn();

    await testExpressValidatorMiddleware(mockReq, mockRes, rules());
    const result = validationResult(mockReq);
    expected(result);
  });
};

describe('validator', () => {
  runTest(
    'undefined - empty',
    () => ({
      body: {},
    }),
    (result) => {
      expect(result.errors).toHaveLength(0);
    }
  );

  const textAreaTestData = [
    {
      title: 'plans-decision',
      errorMessage: `Enter which plans are missing`,
    },
    {
      title: 'statutory-development',
      errorMessage: 'Enter which statutory development plan policies are missing',
    },
    {
      title: 'other-relevant-policies',
      errorMessage: 'Enter which other relevant policies are missing',
    },
    {
      title: 'supplementary-planning',
      errorMessage: 'Enter which supplementary planning documents are missing',
    },
    {
      title: 'conservation-guidance',
      errorMessage: 'Enter what conservation area documentation is missing',
    },
    {
      title: 'listing-description',
      errorMessage: 'Enter what is wrong with the listing description',
    },
    {
      title: 'representations',
      errorMessage: 'Enter which representations are missing or incorrect',
    },
  ];

  textAreaTestData
    .map((test) => getFailedTextBoxAreaValidationTest(test))
    .forEach(({ title, given, expected }) => {
      runTest(title, given, expected);
    });

  textAreaTestData
    .map((test) => getSuccessfulTextBoxAreaValidationTest(test))
    .forEach(({ title, given, expected }) => {
      runTest(title, given, expected);
    });

  const subCheckboxesTestData = [{ title: 'application' }, { title: 'appeal' }];

  subCheckboxesTestData
    .map((test) => getFailedSubCheckboxBoxAreaValidationTest(test))
    .forEach(({ title, given, expected }) => {
      runTest(title, given, expected);
    });

  subCheckboxesTestData
    .map((test) => getSuccessfulSubCheckboxBoxAreaValidationTestV1(test))
    .forEach(({ title, given, expected }) => {
      runTest(title, given, expected);
    });

  subCheckboxesTestData
    .map((test) => getSuccessfulSubCheckboxBoxAreaValidationTestV2(test))
    .forEach(({ title, given, expected }) => {
      runTest(title, given, expected);
    });
});
