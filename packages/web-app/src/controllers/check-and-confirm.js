const {
  checkAndConfirm: currentPage,
  home: nextPage,
  reviewAppealSubmission,
} = require('../config/views');
const saveAndContinue = require('../lib/save-and-continue');
const { getText, getCheckAndConfirmConfig } = require('../config/review-appeal-submission');

const checkAndConfirmConfig = (casework) => getCheckAndConfirmConfig(casework.reviewOutcome);

const viewData = (appeal, casework) => ({
  pageTitle: 'Check and confirm',
  backLink: `/${checkAndConfirmConfig(casework).view}`,
  changeOutcomeLink: `/${reviewAppealSubmission}/${appeal.id}`,
  reviewOutcome: casework,
});

const getCheckAndConfirm = (req, res) => {
  const {
    session: { appeal, casework },
  } = req;

  const options = {
    ...viewData(appeal, casework),
    appealData: appeal,
    checkAndConfirmConfig: checkAndConfirmConfig(casework),
    getText,
  };

  res.render(currentPage, options);
};

const postCheckAndConfirm = (req, res) => {
  const {
    session: { appeal, casework },
  } = req;

  req.session.casework.completed = req.body['check-and-confirm-completed'];

  const options = {
    ...viewData(appeal, casework),
    appealData: appeal,
    checkAndConfirmConfig: getCheckAndConfirmConfig(casework.reviewOutcome),
    getText,
  };

  saveAndContinue({
    req,
    res,
    currentPage,
    nextPage,
    viewData: options,
  });
};

module.exports = {
  getCheckAndConfirm,
  postCheckAndConfirm,
};
