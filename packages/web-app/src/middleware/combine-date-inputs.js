/**
 * Middleware to combine individual day month and year inputs to a single string
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
module.exports = async (req, res, next) => {
  if (!req.body) return next();

  // Check for any day, month, or year fields
  const dayInputs = Object.keys(req.body).filter((key) => key.match(/-(day)+$/));

  if (!dayInputs || !dayInputs.length) return next();

  dayInputs.forEach((input) => {
    const inputGroup = input.replace('-day', '');

    const day = `0${req.body[`${inputGroup}-day`]}`.slice(-2);
    const month = `0${req.body[`${inputGroup}-month`]}`.slice(-2);
    const year = req.body[`${inputGroup}-year`];

    req.body[inputGroup] = `${year}-${month}-${day}`;
  });

  return next();
};
