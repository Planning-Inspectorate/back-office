const saveAndContinue = require('../lib/save-and-continue');
const { saveAppealData } = require('../lib/api-wrapper');

const {
  QUESTIONNAIRE: { REVIEWOUTCOME },
} = require('../constants');
const {
  reviewQuestionnaireSubmission: currentPage,
  questionnairecheckAndConfirm: nextPage,
} = require('../config/views');

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

// eslint-disable-next-line no-shadow
const createPageData = (appeal, questionnaire) => ({
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
    // decisionNotice: createRowObjectData(
    //   'Decision notice',
    //   questionnaire.decisionPlans,
    //   false,
    //   {},
    //   'decision-notice'
    // ),
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
    // listingDescription: {
    //   titleText: 'Listing description',
    //   files: [{ text: questionnaire.affectListedBuildingDetails }],
    //   hasCheckbox: true,
    //   dropDown: { dropDownType: 'TEXT_BOX', title: 'Please add further information' },
    //   checkboxName: 'lpaqreview-listing-description-checkbox',
    //   textAreaName: `lpaqreview-listing-description-textarea`,
    // },
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

const getReviewQuestionnaireSubmission = (req, res) => {
  const {
    session: { appeal, questionnaire },
  } = req;

  const viewData = createPageData(appeal, questionnaire);

  res.render(currentPage, {
    pageTitle: 'Review questionnaire',
    ...viewData,
  });
};

const valueIds = [
  'lpaqreview-officer-report-checkbox',
  'lpaqreview-plans-decision-checkbox',
  'lpaqreview-plans-decision-textarea',
  'lpaqreview-statutory-development-checkbox',
  'lpaqreview-statutory-development-textarea',
  'lpaqreview-other-relevant-policies-checkbox',
  'lpaqreview-other-relevant-policies-textarea',
  'lpaqreview-supplementary-planning-checkbox',
  'lpaqreview-supplementary-planning-textarea',
  'lpaqreview-conservation-guidance-checkbox',
  'lpaqreview-conservation-guidance-textarea',
  'lpaqreview-listing-description-checkbox',
  'lpaqreview-listing-description-textarea',
  'lpaqreview-application-notification-checkbox',
  'lpaqreview-application-notification-subcheckbox1',
  'lpaqreview-application-notification-subcheckbox2',
  'lpaqreview-application-publicity-checkbox',
  'lpaqreview-representations-checkbox',
  'lpaqreview-representations-textarea',
  'lpaqreview-appeal-notification-checkbox',
  'lpaqreview-appeal-notification-subcheckbox1',
  'lpaqreview-appeal-notification-subcheckbox2',
];

const getValues = (body) => {
  const values = {};
  valueIds.forEach((name) => {
    values[name] = body[name];
  });
  return values;
};

const convertValuesToMissingOrIncorrect = (values) => {
  const messages = {
    'lpaqreview-officer-report-checkbox': "Planning Officer's report",
    'lpaqreview-plans-decision-checkbox': 'Plans used to reach the decision:',
    'lpaqreview-statutory-development-checkbox': 'Statutory development plan policies:',
    'lpaqreview-other-relevant-policies-checkbox': 'Other relevant policies:',
    'lpaqreview-supplementary-planning-checkbox': 'Supplementary planning documents:',
    'lpaqreview-conservation-guidance-checkbox': 'Conservation area map and guidance:',
    'lpaqreview-listing-description-checkbox': 'Listing description:',
    'lpaqreview-application-publicity-checkbox': 'Application publicity',
    'lpaqreview-application-notification-checkbox': 'Application notification:',
    'lpaqreview-application-notification-subcheckbox1': 'List of addresses',
    'lpaqreview-application-notification-subcheckbox2': 'Copy of letter or site notice',
    'lpaqreview-representations-checkbox': 'Representations:',
    'lpaqreview-appeal-notification-checkbox': 'Appeal notification:',
    'lpaqreview-appeal-notification-subcheckbox1': 'List of addresses',
    'lpaqreview-appeal-notification-subcheckbox2': 'Copy of letter or site notice',
  };

  const includedMessages = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(values)) {
    if (value === 'on') includedMessages.push(messages[key]);
    if (value !== 'on' && value !== '' && value !== undefined) includedMessages.push(value);
  }

  return includedMessages;
};

const postReviewQuestionnaireSubmission = (req, res) => {
  const {
    body,
    session: { appeal, questionnaire },
  } = req;
  const values = getValues(body);
  const missingOrIncorrectDocuments = convertValuesToMissingOrIncorrect(values);
  const viewData = {
    ...createPageData(appeal, questionnaire),
    values,
    pageTitle: 'Review questionnaire',
  };

  req.session.questionnaire.missingOrIncorrectDocuments = missingOrIncorrectDocuments;
  req.session.questionnaire.outcome =
    missingOrIncorrectDocuments.length > 0 ? REVIEWOUTCOME.INCOMPLETE : REVIEWOUTCOME.COMPLETE;

  saveAndContinue({
    req,
    res,
    currentPage,
    nextPage,
    viewData,
    saveData: saveAppealData,
  });
};

module.exports = { getReviewQuestionnaireSubmission, postReviewQuestionnaireSubmission };