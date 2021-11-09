/**
 * Get the appeal outcome using the appeal id for this session.
 *
 * @param req
 * @param res
 * @param next
 * @returns {any}
 */
module.exports = (req, res, next) => {
  const {
    appeal: { appealId },
  } = req.session;

  if (!appealId) {
    return res.sendStatus(404);
  }

  return next();
};
