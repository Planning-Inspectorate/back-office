const { getData } = require('./api-wrapper');

const getCaseData = (req, res, next) => {
  const {
    cookies,
    log,
    params: { appealId },
  } = req;
  const cookieAppealId = cookies.appealId;

  try {
    /*
      Temporary conditional to clear the session data when a new appeal is selected from the
      Appeals list.

      We need to compare the selected appeal id with the one on the session data rather than
      simply removing the session data each time because we don't want to remove the session
      data if a user has clicked either the 'Back' or 'Change outcome' links on the Valid
      Appeal Details page.

      It's probably not where we'd do it ideally when we've connected the API to the database
      so it can be replaced by a more appropriate solution at that point.
    */
    if (appealId && appealId !== cookieAppealId) {
      log.debug({ appealId, cookieAppealId }, 'Deleting session data');
      res.clearCookie('appealId');
      res.clearCookie(cookieAppealId);
    }

    const currentAppealId = appealId || cookieAppealId;

    log.debug({ id: currentAppealId }, 'Getting existing data');

    req.session = getData(currentAppealId);

    if (req.cookies[currentAppealId]) {
      req.session.casework = JSON.parse(req.cookies[currentAppealId]);
    }

    log.debug({ session: req.session }, 'Set session data');

    next();
  } catch (err) {
    log.debug({ err }, 'Error getting existing data');
    throw err;
  }
};

module.exports = getCaseData;
