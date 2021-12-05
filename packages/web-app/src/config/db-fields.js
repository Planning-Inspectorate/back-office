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
    missingOrWrongReasons: 'missingOrWrongReasons',
    missingOrWrongDocuments: 'missingOrWrongDocuments',
    missingOrWrongOtherReason: 'missingOrWrongOtherReason',
    caseOfficerName: 'caseOfficerName',
    caseOfficerEmail: 'caseOfficerEmail',
  },
  appealLink: {
    questionnaireStatusId: 'questionnaireStatusId',
    caseStatusId: 'caseStatusId',
    appellantName: 'appellantName',
  },
  hasAppealSubmission: {
    creatorEmailAddress: 'creatorEmailAddress',
    decisionDate: 'decisionDate',
  },
};

module.exports = dbFields;
