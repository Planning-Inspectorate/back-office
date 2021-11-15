const { getAppealData } = require("../lib/api-wrapper");

/**
 * Get the appeal outcome using the appeal id for this session.
 *
 * @param req
 * @param res
 * @param next
 * @returns {any}
 */
module.exports = async (req, res, next) => {
  const { appealId } = req.params;

  if (!appealId) {
    return res.sendStatus(404);
  }

  const data = await getAppealData(appealId);
  const { questionnaire, appeal } = data;
  req.session.questionnaire = questionnaire;
  req.session.appeal = appeal;

  return next();
};
