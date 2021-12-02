const { parseISO, isValid } = require('date-fns');
const { applicationDecisionDate: currentPage, appealDetails } = require('../../config/views');
const logger = require('../../lib/logger');
const { saveAppealSubmissionData } = require('../../lib/api-wrapper');
const saveAndContinue = require('../../lib/save-and-continue');
const { hasAppealSubmission } = require('../../config/db-fields');

const viewData = (appeal, errors, errorSummary) => ({
  pageTitle: 'Change application decision date',
  appealData: {
    ...appeal,
  },
  errors,
  errorSummary,
});

exports.getApplicationDecisionDate = (req, res) => {
  const {
    session: { appeal },
  } = req;

  const decisionDate = parseISO(appeal.appealDecisionDate);

  const options = viewData({
    decisionDate: decisionDate && {
      day: `0${decisionDate.getDate()}`.slice(-2),
      month: `0${decisionDate.getMonth() + 1}`.slice(-2),
      year: decisionDate.getFullYear(),
    },
  });

  res.render(currentPage, options);
};

exports.postApplicationDecisionDate = async (req, res) => {
  const { body } = req;
  const { errors = {}, errorSummary = [] } = body;

  const {
    session: {
      appeal: { appealId },
    },
  } = req;

  if (Object.keys(errors).length > 0) {
    const options = viewData(
      {
        decisionDate: {
          day: body['decision-date-day'],
          month: body['decision-date-month'],
          year: body['decision-date-year'],
        },
      },
      errors,
      errorSummary
    );
    res.render(currentPage, options);
    return;
  }

  const decisionDate = body['decision-date'];
  const newAppealDecisionDate = new Date(`${decisionDate}T12:00:00.000Z`);

  const casework = {
    [hasAppealSubmission.decisionDate]: newAppealDecisionDate,
  };

  try {
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
