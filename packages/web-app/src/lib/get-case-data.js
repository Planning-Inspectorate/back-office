const { getAppealData } = require('./api-wrapper');

const getCaseData = async (req, res, next) => {
  const {
    cookies,
    log,
    params: { appealId },
  } = req;
  const cookieAppealId = cookies.appealId;

  try {
    if (appealId && appealId !== cookieAppealId) {
      log.debug({ appealId, cookieAppealId }, 'Deleting session data');
      res.clearCookie('appealId');
      res.clearCookie(cookieAppealId);
      res.clearCookie(`appeal_questionnaire`);
    }

    const currentAppealId = appealId || cookieAppealId;

    log.debug({ id: currentAppealId }, 'Getting existing data');

    req.session = await getAppealData(currentAppealId);

    if (req.cookies[currentAppealId]) {
      req.session.casework = JSON.parse(req.cookies[currentAppealId]);
    }

    if (req.cookies.appeal_questionnaire) {
      req.session.questionnaire = JSON.parse(req.cookies.appeal_questionnaire);
    }

    log.debug({ session: req.session }, 'Set session data');

    next();
  } catch (err) {
    log.error({ err }, 'Failed to get existing data');
    throw new Error(`Failed to get existing data - ${err.message}`);
  }
};

module.exports = getCaseData;
