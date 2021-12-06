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
    siteAddressLineOne: 'siteAddressLineOne',
    siteAddressLineTwo: 'siteAddressLineTwo',
    siteAddressTown: 'siteAddressTown',
    siteAddressCounty: 'siteAddressCounty',
    siteAddressPostcode: 'siteAddressPostcode',
  },
  hasAppealSubmission: {
    creatorEmailAddress: 'creatorEmailAddress',
    decisionDate: 'decisionDate',
  },
};

module.exports = dbFields;
