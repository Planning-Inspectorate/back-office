const getTime = require('date-fns/getTime');
const sortBy = require('lodash/sortBy');
const views = require('../config/views');
const { getAllQuestionnaires } = require('../lib/api-wrapper');

const getStatusColour = (statusText) => {
  switch (statusText) {
    case 'Overdue':
      return 'red';
    case 'Received':
      return 'green';
    default:
      return 'blue';
  }
};

const colouriseStatuses = (data) =>
  data.map((o) => {
    const oNew = { ...o };
    oNew.questionnaireStatusColour = getStatusColour(oNew.questionnaireStatus);
    return oNew;
  });

const getQuestionnairesList = async (req, res) => {
  const questionnaireData = await getAllQuestionnaires();
  const colourisedStatuses = colouriseStatuses(questionnaireData);
  const sortedQuestionnairesData = sortBy(colourisedStatuses, (o) => getTime(new Date(o.dueDate)));

  res.render(views.questionnairesList, {
    sortedQuestionnairesData,
    pageTitle: 'Questionnaires for review',
  });
};

module.exports = getQuestionnairesList;
