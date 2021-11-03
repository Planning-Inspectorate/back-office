const {
  getQuestionnaireDueDate,
  getFormattedQuestionnaireDueDate,
} = require('./questionnaire-due-date');

describe('lib/questionnaire-due-date', () => {
  const FIXED_DATETIME = '2020-11-18T00:00:00Z';

  describe('getQuestionnaireDueDate', () => {
    [
      {
        description: 'defaults to five days - change this when more appeal types are added',
        appeal: {
          submissionDate: new Date(FIXED_DATETIME),
        },
        expectedDueDate: new Date('2020-11-23T23:59:59.999Z'),
      },
      {
        description: 'defaults to five days - variant date',
        appeal: {
          submissionDate: new Date('2021-12-31T13:59:01.462Z'),
        },
        expectedDueDate: new Date('2022-01-05T23:59:59.999Z'),
      },
    ].forEach(({ description, appeal, expectedDueDate }) => {
      it(`should return the correct due date - ${description}`, () => {
        expect(getQuestionnaireDueDate(appeal)).toEqual(expectedDueDate);
      });
    });
  });

  describe('getFormattedQuestionnaireDueDate', () => {
    [
      {
        description: 'defaults to five days - change this when more appeal types are added',
        appeal: {
          submissionDate: new Date(FIXED_DATETIME),
        },
        expectedDueDate: '23 November 2020',
      },
      {
        description: 'defaults to five days - variant date',
        appeal: {
          submissionDate: new Date('2022-12-31T01:00:01.462Z'),
        },
        expectedDueDate: '05 January 2023',
      },
    ].forEach(({ description, appeal, expectedDueDate }) => {
      it(`should return the correctly formatted due date - ${description}`, () => {
        expect(getFormattedQuestionnaireDueDate(appeal)).toEqual(expectedDueDate);
      });
    });
  });
});
