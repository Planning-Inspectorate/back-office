const views = require('../config/views');
const { getData } = require('../lib/api-wrapper');
const saveAndContinue = require('../lib/save-and-continue');

let appealId = '';

const populateFilesObject = (files) => {
  if (Array.isArray(files)) {
    return files.map((file) => ({ link: `/document/${appealId}/${file.id}`, text: file.name }));
  }
  return [{ link: `/document/${appealId}/${files.id}`, text: files.name }];
};

const createRowObjectData = (titleText, files, hasCheckbox, dropDown, htmlId) => ({
  titleText,
  files: populateFilesObject(files),
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

const createPageData = () => {
  // TODO collect data for id rathar than mocked data
  const { appeal, questionnaire } = getData(appealId);

  return {
    appealInfo: {
      appealReferenceTitle: 'Appeal reference',
      appealReference: appeal.id,
      appealSiteTitle: 'Appeal site',
      address: {
        addressLine1: appeal.appealSiteSection.siteAddress.addressLine1,
        addressLine2: appeal.appealSiteSection.siteAddress.addressLine2,
        town: appeal.appealSiteSection.siteAddress.town,
        county: appeal.appealSiteSection.siteAddress.county,
        postcode: appeal.appealSiteSection.siteAddress.postcode,
      },
      localPlanningDepartmentTitle: 'Local planning department',
      localPlanningDepartment: appeal.lpaCode,
    },
    planningApplication: {
      sectionTitle: 'The planning application',
      planningApplicationReference: {
        titleText: 'Planning application reference',
        cellText: appeal.requiredDocumentsSection.applicationNumber,
      },
      decisionNotice: createRowObjectData(
        'Decision notice',
        appeal.requiredDocumentsSection.decisionLetter.uploadedFile,
        false,
        {},
        'decision-notice'
      ),
      officersReport: createRowObjectData(
        "Planning Officer's report",
        questionnaire.requiredDocumentsSection.officersReport.uploadedFiles,
        true,
        {},
        'officer-report'
      ),
      plansDecision: createRowObjectData(
        'Plans used to reach decision',
        questionnaire.requiredDocumentsSection.plansDecision.uploadedFiles,
        true,
        { dropDownType: 'TEXT_BOX', title: 'Which plans are missing?' },
        'plans-decision'
      ),
    },
    localPlansPolicies: {
      sectionTitle: 'Local plans and policies',
      statutoryDevelopmentPlanPolicies: createRowObjectData(
        'Statutory development plan policies',
        questionnaire.optionalDocumentsSection.statutoryDevelopment.uploadedFiles,
        true,
        { dropDownType: 'TEXT_BOX', title: 'Which policies are missing?' },
        'statutory-development'
      ),
      otherRelevantPolicies: createRowObjectData(
        'Other relevant policies',
        questionnaire.optionalDocumentsSection.otherPolicies.uploadedFiles,
        true,
        { dropDownType: 'TEXT_BOX', title: 'Which policies are missing?' },
        'other-relevant-policies'
      ),
      supplementaryPlanningDocuments: createRowObjectData(
        'Supplementary planning documents',
        questionnaire.optionalDocumentsSection.supplementaryPlanningDocuments.uploadedFiles,
        true,
        { dropDownType: 'TEXT_BOX', title: 'Which documents are missing?' },
        'supplementary-planning'
      ),
    },
    aboutAppealSite: {
      sectionTitle: 'About the appeal site',
      nearConservationArea: {
        titleText: 'Is the appeal site in or near a conservation area?',
        cellText: questionnaire.nearConservationArea ? 'Yes' : 'No',
      },
      conservationAreaMapGuidance: createRowObjectData(
        'Conservation area map and guidance',
        questionnaire.optionalDocumentsSection.conservationAreaMap.uploadedFiles,
        true,
        { dropDownType: 'TEXT_BOX', title: 'What is missing or incorrect?' },
        'conservation-guidance'
      ),
      developmentAffectSettings: {
        titleText: 'Would the development affect the setting of a listed building?',
        cellText: questionnaire.listedBuilding.affectSetting ? 'Yes' : 'No',
      },
      listingDescription: {
        titleText: 'Listing description',
        files: [{ text: questionnaire.listedBuilding.buildingDetails }],
        hasCheckbox: true,
        dropDown: { dropDownType: 'TEXT_BOX', title: 'Please add further information' },
        checkboxName: 'lpaqreview-listing-description-checkbox',
        textAreaName: `lpaqreview-listing-description-textarea`,
      },
    },
    interestedParties: {
      sectionTitle: 'Interested parties',
      applicationNotification: createRowObjectData(
        'Application notification',
        questionnaire.optionalDocumentsSection.interestedPartiesApplication.uploadedFiles,
        true,
        createSubCheckboxData('application'),
        'application-notification'
      ),
      applicationPublicity: createRowObjectData(
        'Application publicity',
        questionnaire.optionalDocumentsSection.siteNotices.uploadedFiles,
        true,
        {},
        'application-publicity'
      ),
      representations: createRowObjectData(
        'Representations',
        questionnaire.optionalDocumentsSection.representationsInterestedParties.uploadedFiles,
        true,
        { dropDownType: 'TEXT_BOX', title: 'Which representations are missing or incorrect?' },
        'representations'
      ),
      appealNotification: createRowObjectData(
        'Appeal notification',
        questionnaire.optionalDocumentsSection.interestedPartiesAppeal.uploadedFiles,
        true,
        createSubCheckboxData('appeal'),
        'appeal-notification'
      ),
    },
    finishedReviewTitle: 'Finished your review?',
    submissionButtontext: 'Continue',
  };
};

const getReviewQuestionnaire = (req, res) => {
  appealId = req.params.id;
  const viewData = createPageData();

  res.render(views.reviewQuestionnaire, {
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
  const messages = [
    { n: 'lpaqreview-officer-report-checkbox', m: "Planning Officer's report" },
    { n: 'lpaqreview-plans-decision-checkbox', m: 'Plans used to reach the decision' },
    { n: 'lpaqreview-statutory-development-checkbox', m: 'Statutory development plan policies' },
    { n: 'lpaqreview-other-relevant-policies-checkbox', m: 'Other relevant policies' },
    { n: 'lpaqreview-supplementary-planning-checkbox', m: 'Supplementary planning documents' },
    { n: 'lpaqreview-conservation-guidance-checkbox', m: 'Conservation area map and guidance' },
    { n: 'lpaqreview-application-notification-checkbox', m: 'Application notification' },
    { n: 'lpaqreview-application-publicity-checkbox', m: 'Application publicity' },
    { n: 'lpaqreview-representations-checkbox', m: 'Representations' },
    { n: 'lpaqreview-appeal-notification-checkbox', m: 'Appeal notification' },
  ];

  const includedMessages = [];

  messages.forEach((item) => {
    if (values[item.n] === 'on') includedMessages.push(item.m);
  });

  return includedMessages;
};

const postReviewQuestionnaire = (req, res) => {
  const values = getValues(req.body);
  const viewData = { ...createPageData(), values, pageTitle: 'Review questionnaire' };

  req.session.questionnaire = {
    missingOrIncorrectDocuments: convertValuesToMissingOrIncorrect(values),
  };

  saveAndContinue({
    req,
    res,
    currentPage: views.reviewQuestionnaire,
    nextPage: `/questionnaires-for-review/check-and-confirm/${appealId}`,
    viewData,
  });
};

module.exports = { getReviewQuestionnaire, postReviewQuestionnaire };
