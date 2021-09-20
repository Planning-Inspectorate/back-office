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
  if (!req?.session?.appeal?.appeal?.id) {
    return res.sendStatus(401);
  }

  if (req.params.appealId !== req.session.appeal.appeal.id) {
    return res.sendStatus(403);
  }

  return next();
};
