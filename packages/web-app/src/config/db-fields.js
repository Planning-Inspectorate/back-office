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
    caseOfficerFirstName: 'caseOfficerFirstName',
    caseOfficerEmail: 'caseOfficerEmail',
  },
  appealLink: {
    questionnaireStatusId: 'questionnaireStatusId',
    caseStatusId: 'caseStatusId',
    appellantName: 'appellantName',
  },
  hasAppealSubmission: {
    creatorEmailAddress: 'creatorEmailAddress',
  },
};

module.exports = dbFields;
