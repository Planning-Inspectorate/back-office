/**
 * A middleware function that modifies Prisma Client parameters for Document model.
 * The middleware ensures that when fetching Document data, only non-deleted records are returned.
 * When deleting a Document, it updates the `isDeleted` property instead of actually deleting the record.
 *
 * @param {import('@prisma/client').Prisma.MiddlewareParams} parameters - The Prisma Client parameters object.
 * @param {(arg0: any) => any} next - The next middleware in the chain.
 * @returns {Promise<(arg0: any) => any>} The result of the next middleware in the chain.
 */
export async function modifyPrismaDocumentQueryMiddleware(parameters, next) {
	const allowedModels = new Set(['Document', 'DocumentVersion']);

	const includeDeleted = parameters.action.endsWith('WithDeleted');
	if (includeDeleted) {
		// Doing hacky string manipulation to allow querying deleted records
		// in special cases. The type checker doesn't like this.
		// @ts-ignore
		parameters.action = parameters.action.slice(0, -11);
	}

	const isDeleteAction = parameters.action === 'delete';

	const isCountAction = parameters.action === 'count';

	const isFindUniqueOrFirst =
		parameters.action === 'findUnique' || parameters.action === 'findFirst';

	const isFindMany = parameters.action === 'findMany';

	if (!allowedModels.has(String(parameters?.model))) return next(parameters);

	if (isFindUniqueOrFirst) {
		// Change action to findFirst - you cannot filter by anything except (ID or setting a unique constraint) with findUnique
		parameters.action = 'findFirst';

		const whereClause = parameters.args?.where;

		if (!includeDeleted) {
			const isDeleted = whereClause?.isDeleted ? whereClause.isDeleted : false;

			parameters.args.where = whereClause
				? { ...parameters.args.where, isDeleted }
				: { isDeleted: false };
		}
	} else if (isFindMany) {
		const whereClause = parameters.args?.where;
		const isDeleted = whereClause?.isDeleted ? whereClause.isDeleted : false;

		parameters.args.where = whereClause
			? { ...parameters.args.where, isDeleted }
			: { isDeleted: false };
	} else if (isDeleteAction) {
		parameters.action = 'update';
		parameters.args.data = { isDeleted: true };
	} else if (isCountAction) {
		parameters.args.where = { ...parameters.args.where, isDeleted: false };
	}

	return next(parameters);
}
