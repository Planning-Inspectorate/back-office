const { format, add } = require('date-fns');
const { v4: uuidV4 } = require('uuid');

const appealHASAppealColumns =
  // eslint-disable-next-line no-multi-str
  'INSERT INTO [HASAppeal] ([ID], [AppealID], [RecommendedSiteVisitTypeID], [SiteVisitTypeID], [CaseOfficerFirstName], [CaseOfficerSurname], \
    [CaseOfficerID], [LPAQuestionnaireReviewOutcomeID], [LPAIncompleteReasons], [ValidationOfficerFirstName], [ValidationOfficerSurname], [ValidationOfficerID], \
    [ValidationOutcomeID], [InvalidReasonOtherDetails], [InvalidAppealReasons], [InspectorFirstName], [InspectorSurname], [InspectorID], [InspectorSpecialismID], \
    [ScheduledSiteVisitDate], [DecisionOutcomeID], [DecisionLetterID], [DecisionDate], [DescriptionDevelopment], [LatestEvent], [EventDateTime], [EventUserID], \
    [EventUserName], [CheckSumRow], [CaseOfficerEmail], [InspectorEmail], [ValidationOfficerEmail], [AppealStartDate], [AppealValidationDate], [QuestionnaireDueDate], \
    [MissingOrWrongReasons], [MissingOrWrongDocuments], [MissingOrWrongOtherReason]) VALUES(';

const appealLinkColumns =
  // eslint-disable-next-line no-multi-str
  'INSERT INTO [AppealLink] ([ID], [AppealID], [LPAQuestionnaireID], [CaseReference], [CaseTypeID], [CaseStageID], [CaseStatusID], [AppellantName], [SiteAddressLineOne], \
    [SiteAddressLineTwo], [SiteAddressTown], [SiteAddressCounty], [SiteAddressPostCode], [LocalPlanningAuthorityID], [LatestEvent], [EventDateTime], [EventUserID], \
    [EventUserName], [CheckSumRow], [QuestionnaireStatusID]) VALUES(';

const generateHASAppeal = (appealId, questionnaireDueDate) => {
  return `${appealHASAppealColumns}'${uuidV4()}', '${appealId}', 1, 1, 'CaseOfficerFirstName', 'CaseOfficerSurname', 'CaseOfficerID', 1,
   'LPAIncompleteReasons', 'ValidationOfficerFirstName', 'ValidationOfficerSurname', 'ValidationOfficerID', 1, 'InvalidReasonOtherDetails', 'InvalidAppealReasons', 
   'InspectorFirstName', 'InspectorSurname', 'InspectorID', 1, '2021-01-01', 1, 'DecisionLetterID', '2021-01-01', 'DescriptionDevelopment', 1, '2021-01-01', 
   'EventUserID', 'EventUserName', 0, 'CaseOfficerEmail', 'InspectorEmail', 'ValidationOfficerEmail', '2021-01-01', '2021-01-01', '${questionnaireDueDate}', 
   'MissingOrWrongReasons', 'MissingOrWrongDocuments', 'MissingOrWrongOtherReason');`;
};

const generateAppealLink = (appealId, statusType) => {
  return `${appealLinkColumns}'${uuidV4()}', '${appealId}', '${uuidV4()}', 0, 1, 1, 1, 'AppellantName', 'SiteAddressLineOne', 'SiteAddressLineTwo', 'SiteAddressTown', \
    'SiteAddressCounty', 'A123BC', 'E60000001', 1, '2021-01-01', 'h', 'i', 0, ${statusType});`;
};

/**
 * @name initialiseInsertArray
 * @description Initialises and returns an array uuids for AppealID
 * @param {integer} numStatuses Number of AppealID strings to generate
 * @return {array} Array containing AppealID strings
 */
const initialiseInsertArray = (numStatuses) => {
  return new Array(numStatuses).fill('').map(() => {
    return uuidV4();
  });
};

/**
 * @name createUpdateStatusInserts
 * @description Maps initialised array to concatenated sql insert strings for HASAppeal table and AppealLink table
 * @param {integer} numStatuses Number of pairs of insert strings
 * @param {integer} statusType Integer to populate the QuestionnaireStatusID
 * @return {string} string of insert statements
 */
module.exports.createUpdateStatusInserts = (numStatuses = 1, statusType = 1) => {
  console.log(format(add(new Date(), { days: -1 }), 'yyyy-MM-dd'));
  return initialiseInsertArray(numStatuses)
    .map((appealId) => {
      return `${generateAppealLink(appealId, statusType)} ${generateHASAppeal(
        appealId,
        format(add(new Date(), { days: -1 }), 'yyyy-MM-dd')
      )}`;
    })
    .join('');
};
