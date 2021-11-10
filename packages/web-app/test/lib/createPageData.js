const populateFilesObject = (files, lpaQuestionnaireId) => {
  if (!files) {
    return [{ text: 'No files uploaded' }];
  }

  if (Array.isArray(files)) {
    return files.map((file) => ({
      link: `/document/${lpaQuestionnaireId}/${file.id}`,
      text: file.name,
    }));
  }
  return [{ link: `/document/${lpaQuestionnaireId}/${files.id}`, text: files.name }];
};

const createSubCheckboxData = (name) => ({
  dropDownType: 'DOUBLE_CHECK_BOX',
  title: 'What is missing or incorrect?',
  subCheckBoxes: [
    {
      text: 'List of addresses',
      name: `lpaqreview-${name}-notification-subcheckbox1`,
    },
    {
      text: 'Copy of letter or site notice',
      name: `lpaqreview-${name}-notification-subcheckbox2`,
    },
  ],
});

const createRowObjectData = (
  titleText,
  files,
  hasCheckbox,
  dropDown,
  htmlId,
  lpaQuestionnaireId
) => ({
  titleText,
  files: populateFilesObject(files, lpaQuestionnaireId),
  hasCheckbox,
  dropDown,
  checkboxName: `lpaqreview-${htmlId}-checkbox`,
  textAreaName: `lpaqreview-${htmlId}-textarea`,
});

module.exports.createPageData = (appeal, questionnaire) => ({
  appealInfo: {
    appealReferenceTitle: 'Appeal reference',
    appealReference: questionnaire.caseReference,
    appealSiteTitle: 'Appeal site',
    address: {
      addressLine1: questionnaire.siteAddressLineOne,
      addressLine2: questionnaire.siteAddressLineTwo,
      town: questionnaire.siteAddressTown,
      county: questionnaire.siteAddressCounty,
      postcode: questionnaire.siteAddressPostCode,
    },
    localPlanningDepartmentTitle: 'Local planning department',
    localPlanningDepartment: questionnaire.localPlanningAuthorityName,
  },
  planningApplication: {
    sectionTitle: 'The planning application',
    planningApplicationReference: {
      titleText: 'Planning application reference',
      cellText: appeal.originalApplicationNumber,
    },
    officersReport: createRowObjectData(
      "Planning Officer's report",
      questionnaire.officersReport,
      true,
      {},
      'officer-report',
      questionnaire.lpaQuestionnaireId
    ),
    plansDecision: createRowObjectData(
      'Plans used to reach decision',
      questionnaire.decisionPlans,
      true,
      { dropDownType: 'TEXT_BOX', title: 'Which plans are missing?' },
      'plans-decision',
      questionnaire.lpaQuestionnaireId
    ),
  },
  localPlansPolicies: {
    sectionTitle: 'Local plans and policies',
    statutoryDevelopmentPlanPolicies: createRowObjectData(
      'Statutory development plan policies',
      questionnaire.statutoryDevelopment,
      true,
      { dropDownType: 'TEXT_BOX', title: 'Which policies are missing?' },
      'statutory-development',
      questionnaire.lpaQuestionnaireId
    ),
    otherRelevantPolicies: createRowObjectData(
      'Other relevant policies',
      questionnaire.otherPolicies,
      true,
      { dropDownType: 'TEXT_BOX', title: 'Which policies are missing?' },
      'other-relevant-policies',
      questionnaire.lpaQuestionnaireId
    ),
    supplementaryPlanningDocuments: createRowObjectData(
      'Supplementary planning documents',
      questionnaire.supplementaryDocuments,
      true,
      { dropDownType: 'TEXT_BOX', title: 'Which documents are missing?' },
      'supplementary-planning',
      questionnaire.lpaQuestionnaireId
    ),
  },
  aboutAppealSite: {
    sectionTitle: 'About the appeal site',
    nearConservationArea: {
      titleText: 'Is the appeal site in or near a conservation area?',
      cellText: questionnaire.conservationArea ? 'Yes' : 'No',
    },
    conservationAreaMapGuidance: createRowObjectData(
      'Conservation area map and guidance',
      questionnaire.notifyingParties,
      true,
      { dropDownType: 'TEXT_BOX', title: 'What is missing or incorrect?' },
      'conservation-guidance',
      questionnaire.lpaQuestionnaireId
    ),
    developmentAffectSettings: {
      titleText: 'Would the development affect the setting of a listed building?',
      cellText: questionnaire.affectListedBuilding ? 'Yes' : 'No',
    },
  },
  interestedParties: {
    sectionTitle: 'Interested parties',
    applicationNotification: createRowObjectData(
      'Application notification',
      questionnaire.interestedParties,
      true,
      createSubCheckboxData('application'),
      'application-notification',
      questionnaire.lpaQuestionnaireId
    ),
    applicationPublicity: createRowObjectData(
      'Application publicity',
      questionnaire.siteNotices,
      true,
      {},
      'application-publicity',
      questionnaire.lpaQuestionnaireId
    ),
    representations: createRowObjectData(
      'Representations',
      questionnaire.representations,
      true,
      { dropDownType: 'TEXT_BOX', title: 'Which representations are missing or incorrect?' },
      'representations',
      questionnaire.lpaQuestionnaireId
    ),
    appealNotification: createRowObjectData(
      'Appeal notification',
      questionnaire.notifyingParties,
      true,
      createSubCheckboxData('appeal'),
      'appeal-notification',
      questionnaire.lpaQuestionnaireId
    ),
  },
  finishedReviewTitle: 'Finished your review?',
  submissionButtontext: 'Continue',
});
