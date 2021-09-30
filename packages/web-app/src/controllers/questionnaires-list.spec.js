const getQuestionnairesList = require('./questionnaires-list');
const views = require('../config/views');

describe('controllers/questionnaires-list', () => {
  describe('questionnairesList', () => {
    it('should render the view with data correctly', () => {
      const req = {};
      const res = {
        render: jest.fn(),
      };

      getQuestionnairesList(req, res);

      expect(res.render).toBeCalledTimes(1);
      expect(res.render).toBeCalledWith(views.questionnairesList, {
        sortedQuestionnairesData: [
          {
            id: 'af9e8ad2-08f2-482e-9907-f5417b04449e',
            reference: 'APP/Q9999/D/21/1200988',
            dueDate: '15 February 2021',
            site: '118 Green Lanes, Wylde Green, B73 5JH',
            status: { text: 'Overdue', colour: 'red' },
          },
          {
            id: 'ac71729a-87ea-4266-a42b-a74a4514a535',
            reference: 'BRL/Q9999/D/21/8857835',
            dueDate: '3 March 2021',
            site: '29 Meadow View, Haltwhistle, NE49 9PE',
            status: { text: 'Received', colour: 'green' },
          },
          {
            id: '0b95a739-53c3-4c97-be09-7f9496143ae8',
            reference: 'APP/Q9999/D/21/0671424',
            dueDate: '8 March 2021',
            site: '23 Gelliargwellt Road, Penybryn, CF82 7FY',
            status: { text: 'Awaiting', colour: 'blue' },
          },
          {
            id: '12ec270d-7504-40d9-bd43-76c9d32d7149',
            reference: 'APP/Q9999/D/21/7710092',
            dueDate: '2 April 2021',
            site: '2 Oval Road, London, NW1 7EB',
            status: { text: 'Awaiting', colour: 'blue' },
          },
          {
            id: 'c5a3f924-e501-4f9a-b954-af0fe86b2793',
            reference: 'APP/Q9999/D/21/1049726',
            dueDate: '26 April 2021',
            site: '27 Christ Church Lane, Lichfield, WS13 8AY',
            status: { text: 'Overdue', colour: 'red' },
          },
          {
            id: '36acb929-63be-454e-8155-8becda906ef0',
            reference: 'APP/Q9999/D/21/2364500',
            dueDate: '6 May 2021',
            site: 'Flat 8, Laburnum Court, 86 Auckland Road, London, SE19 2EE',
            status: { text: 'Received', colour: 'green' },
          },
          {
            id: '42994fce-36fb-406d-a20d-0a5c4f7f3a54',
            reference: 'APP/Q9999/D/21/4365198',
            dueDate: '6 July 2021',
            site: '8 Edmund Drive, Leigh, WN7 5BN',
            status: { text: 'Received', colour: 'green' },
          },
          {
            id: '25fffd12-f447-4412-90f5-2db8a07e955c',
            reference: 'APP/Q9999/D/21/9847354',
            dueDate: '27 July 2021',
            site: 'Flat 1, Regent Buildings, Church Road, Barmouth, LL42 1AG',
            status: { text: 'Awaiting', colour: 'blue' },
          },
        ],
        pageTitle: 'Questionnaires for review',
      });
    });
  });
});
