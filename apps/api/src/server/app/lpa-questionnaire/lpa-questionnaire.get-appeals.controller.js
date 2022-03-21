const appealWithQuestionnnaire = [{
	AppealId : 1,
	AppealReference: 'APP/Q9999/D/21/1345264',
	QuestionnaireDueDate:'01 Jun 2022',
	AppealSite:'96 The Avenue, Maidstone, Kent, MD21 5XY',
	QuestionnaireStatus: 'received'
},
{
	AppealId : 2,
	AppealReference: 'APP/Q9999/D/21/5463281',
	QuestionnaireDueDate: ' 05 Jun 2022',
	AppealSite:'55 Butcher Street, Thurnscoe, S63 0RB' ,
	QuestionnaireStatus: 'incomplete'
}];

const getAppeals = function (request, response) {
	response.send(appealWithQuestionnnaire);
};

export { getAppeals };
