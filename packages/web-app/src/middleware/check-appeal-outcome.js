/**
 * Ensure the appeal ID given in `request.params.appealId` matches the appeal id currently set
 * in the session.
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

  if (appealId) {
    req.session.outcome = 'COMPLETE';
  }

  return next();
};
