/**
 * Get the appeal outcome using the appeal id for this session.
 *
 * @param req
 * @param res
 * @param next
 * @returns {any}
 */
module.exports = (req, res, next) => {
  const { appeal } = req.session;
  const appealId = appeal.id;

  if (!appealId) {
    return res.sendStatus(404);
  }

  return next();
};
