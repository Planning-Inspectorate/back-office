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
		parameters.action = 'update';
		parameters.args.data = { isDeleted: true };
	}

	return next(parameters);
}
