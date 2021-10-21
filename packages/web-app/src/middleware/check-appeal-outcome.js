/**
 * Get the appeal outcome using the appeal id for this session.
 *
 * @param req
 * @param res
 * @param next
 * @returns {any}
 */
module.exports = (req, res, next) => {
  const { appealId } = req.params;

  if (!appealId) {
    return res.sendStatus(404);
  }

  if (appealId === 1) {
    req.session.outcome = 'COMPLETE';
  }

  if (appealId === 2) {
    req.session.outcome = 'INCOMPLETE';
  }

  return next();
};
