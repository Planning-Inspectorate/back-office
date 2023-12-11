/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export const addRepresentationValuesToBody = async (req, res, next) => {
	const { originalRepresentation, received, type, represented, representative, representedType } =
		res.locals.representation;

	req.body = {
		originalRepresentation,
		received,
		type,
		representedType,
		represented,
		representative
	};

	next();
};
