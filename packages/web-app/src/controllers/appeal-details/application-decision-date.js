const { parseISO } = require('date-fns');
const { applicationDecisionDate: currentPage, appealDetails } = require('../../config/views');
const { saveAppealSubmissionData } = require('../../lib/api-wrapper');
const saveAndContinue = require('../../lib/save-and-continue');
const { hasAppealSubmission } = require('../../config/db-fields');

const viewData = (data, errors, errorSummary) => ({
  ...data,
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

  const {
    session: {
      appeal: { appealId },
    },
  } = req;

  const decisionDate = body['decision-date'];
  const newAppealDecisionDate = new Date(`${decisionDate}T12:00:00.000Z`);

  req.session.casework = {
    [hasAppealSubmission.decisionDate]: newAppealDecisionDate,
  };

  saveAndContinue({
    req,
    res,
    currentPage,
    nextPage: `${appealDetails}/${appealId}`,
    viewData: {
      decisionDate: {
        day: body['decision-date-day'],
        month: body['decision-date-month'],
        year: body['decision-date-year'],
      },
    },
    saveData: saveAppealSubmissionData,
  });
};
