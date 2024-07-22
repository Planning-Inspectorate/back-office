/**
 * A middleware function that modifies Prisma Client parameters for Document model.
 * When deleting a Document, it updates the `isDeleted` property instead of actually deleting the record.
 *
 * @param {import('@prisma/client').Prisma.MiddlewareParams} parameters - The Prisma Client parameters object.
 * @param {(arg0: any) => any} next - The next middleware in the chain.
 * @returns {Promise<(arg0: any) => any>} The result of the next middleware in the chain.
 */
export async function modifyPrismaDocumentQueryMiddleware(parameters, next) {
	if (parameters.model === 'Document' && parameters.action === 'delete') {
		if (parameters.args.isTraining) {
			delete parameters.args.isTraining;
		} else {
			parameters.action = 'update';
			parameters.args.data = { isDeleted: true };
		}
	}
	if (process.env.NODE_ENV !== 'seeding' && parameters.model === 'Folder') {
		if (parameters.action === 'delete') {
			parameters.action = 'update';
			parameters.args = parameters.args || {};
			parameters.args.data = { deletedAt: new Date() };
		}
		if (parameters.action === 'deleteMany') {
			parameters.action = 'updateMany';
			parameters.args = parameters.args || {};
			parameters.args.data = { deletedAt: new Date() };
		}
		if (
			(parameters.action.startsWith('find') || parameters.action === 'count') &&
			!parameters.args.includeDeleted
		) {
			parameters.args = parameters.args || {};
			parameters.args.where = {
				...parameters.args.where,
				deletedAt: { equals: null }
			};
		}
	}

	return next(parameters);
}
