const getQuestionnairesList = require('./questionnaires-list');
const views = require('../config/views');
const { getAllQuestionnaires } = require('../lib/api-wrapper');

jest.mock('../lib/api-wrapper', () => ({
  getAllQuestionnaires: jest.fn(),
}));

describe('controllers/questionnaires-list', () => {
  const req = {};
  const res = {
    render: jest.fn(),
  };
  const questionnairesListData = [
    {
      id: 'af9e8ad2-08f2-482e-9907-f5417b04449e',
      reference: 'APP/Q9999/D/21/1200988',
      dueDate: '15 February 2021',
      site: '118 Green Lanes, Wylde Green, B73 5JH',
    },
  ];

  describe('questionnairesList', () => {
    it('should render the view with data correctly for Overdue cases', async () => {
      questionnairesListData[0].questionnaireStatus = 'Overdue';
      questionnairesListData[0].questionnaireStatusColour = 'red';

      getAllQuestionnaires.mockReturnValue(questionnairesListData);

      await getQuestionnairesList(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.questionnairesList, {
        sortedQuestionnairesData: questionnairesListData,
        pageTitle: 'Questionnaires for review',
      });
    });

    it('should render the view with data correctly for Received cases', async () => {
      questionnairesListData[0].questionnaireStatus = 'Received';
      questionnairesListData[0].questionnaireStatusColour = 'green';

      getAllQuestionnaires.mockReturnValue(questionnairesListData);

      await getQuestionnairesList(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.questionnairesList, {
        sortedQuestionnairesData: questionnairesListData,
        pageTitle: 'Questionnaires for review',
      });
    });

    it('should render the view with data correctly for any other cases', async () => {
      questionnairesListData[0].questionnaireStatus = 'Closed';
      questionnairesListData[0].questionnaireStatusColour = 'blue';

      getAllQuestionnaires.mockReturnValue(questionnairesListData);

      await getQuestionnairesList(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.questionnairesList, {
        sortedQuestionnairesData: questionnairesListData,
        pageTitle: 'Questionnaires for review',
      });
    });
  });
});
