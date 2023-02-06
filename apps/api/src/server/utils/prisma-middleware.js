import { Prisma } from '@prisma/client';

/**
 * @param {Prisma.MiddlewareParams} parameters
 * @param {(arg0: any) => any} next
 */
export async function prismaClientDocumentMiddleWare(parameters, next) {
	const isDocumentModel = parameters.model === 'Document';

	const isDeleteAction = parameters.action === 'delete';

	const isCountAction = parameters.action === 'count';

	const isFindUniqueOrFirst =
		parameters.action === 'findUnique' || parameters.action === 'findFirst';

	const isFindMany = parameters.action === 'findMany';

	if (!isDocumentModel) return next(parameters);

	if (isFindUniqueOrFirst) {
		// Change action to findFirst - you cannot filter by anything except (ID or setting a unique constraint) with findUnique
		parameters.action = 'findFirst';
		parameters.args.where = { ...parameters.args.where, isDeleted: false };
	} else if (isFindMany) {
		const hasWhere = parameters.args?.where;
		const isDeleted = hasWhere?.isDeleted ? hasWhere.isDeleted : false;

		parameters.args.where = hasWhere
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
