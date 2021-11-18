const dbFields = {
  hasAppeal: {
    reviewOutcome: 'validationOutcomeId',
    validAppealDetails: 'descriptionDevelopment',
    invalidAppealReasons: 'invalidAppealReasons',
    invalidReasonOther: 'invalidReasonOtherDetails',
    appealStartDate: 'appealStartDate',
    appealValidationDate: 'appealValidationDate',
    questionnaireDueDate: 'questionnaireDueDate',
    appealValidDate: 'appealValidDate',
  },
  appealLink: {
    questionnaireStatusId: 'questionnaireStatusId',
    caseStatusId: 'caseStatusId',
  },
};

module.exports = dbFields;
