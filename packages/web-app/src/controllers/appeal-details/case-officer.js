const { caseOfficer: currentPage, appealDetails } = require('../../config/views');
const logger = require('../../lib/logger');
const { saveAppealData } = require('../../lib/api-wrapper');
const saveAndContinue = require('../../lib/save-and-continue');
const { hasAppeal } = require('../../config/db-fields');

const viewData = (appeal, errors, errorSummary) => ({
  pageTitle: 'Change agent details',
  appealData: {
    ...appeal,
  },
  errors,
  errorSummary,
});

exports.getCaseOfficerDetails = (req, res) => {
  const {
    session: {
      appeal: { caseOfficerName, caseOfficerEmail },
    },
  } = req;

  const options = viewData({
    caseOfficerName,
    caseOfficerEmail,
  });

  res.render(currentPage, options);
};

exports.postCaseOfficerDetails = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  const {
    session: {
      appeal: { appealId },
    },
  } = req;

  const newCaseOfficerName = req.body['case-officer-name'];
  const newCaseOfficerEmail = req.body['case-officer-email'];

  const casework = {
    [hasAppeal.caseOfficerName]: newCaseOfficerName,
    [hasAppeal.caseOfficerEmail]: newCaseOfficerEmail,
  };

  if (Object.keys(errors).length > 0) {
    const options = viewData(casework, errors, errorSummary);
    res.render(currentPage, options);
    return;
  }

  try {
    await saveAppealData({
      appealId,
      ...casework,
    });
    req.session.casework = casework;
    saveAndContinue({
      req,
      res,
      currentPage,
      nextPage: `${appealDetails}/${appealId}`,
      viewData: casework,
      saveData: saveAppealData,
    });
  } catch (e) {
    logger.error(e);
    const options = viewData(casework, errors, [{ text: e.toString(), href: '#' }]);
    res.render(currentPage, options);
  }
};
