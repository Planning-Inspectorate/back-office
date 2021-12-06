const { appellant: currentPage, appealDetails } = require('../../config/views');
const logger = require('../../lib/logger');
const { saveAppealLinkData, saveAppealSubmissionData } = require('../../lib/api-wrapper');
const saveAndContinue = require('../../lib/save-and-continue');
const { hasAppealSubmission, appealLink } = require('../../config/db-fields');

const viewData = (appeal, errors, errorSummary) => ({
  appealData: {
    ...appeal,
  },
  errors,
  errorSummary,
});

exports.getAppellantDetails = (req, res) => {
  const {
    session: {
      appeal: { appellantName, creatorEmailAddress },
    },
  } = req;

  const options = viewData({
    appellantName,
    creatorEmailAddress,
  });

  res.render(currentPage, options);
};

exports.postAppellantDetails = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  const {
    session: {
      appeal: { appealId },
    },
  } = req;

  const newAppellantName = req.body['appellant-name'];
  const newAppellantEmail = req.body['appellant-email'];

  const casework = {
    [appealLink.appellantName]: newAppellantName,
    [hasAppealSubmission.creatorEmailAddress]: newAppellantEmail,
  };

  if (Object.keys(errors).length > 0) {
    const options = viewData(casework, errors, errorSummary);
    res.render(currentPage, options);
    return;
  }

  try {
    await saveAppealLinkData({
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
      saveData: saveAppealSubmissionData,
    });
  } catch (e) {
    logger.error(e);
    const options = viewData(casework, errors, [{ text: e.toString(), href: '#' }]);
    res.render(currentPage, options);
  }
};
