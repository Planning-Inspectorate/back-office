import { Prisma } from '@prisma/client';

const isSeeding = process.env.NODE_ENV === 'seeding';

/**
 * An extension that modifies Prisma Client queries for the Document and Folders models.
 * When deleting a Document, it updates the `isDeleted` property instead of actually deleting the record
 * unless the `hardDelete` arg is included.
 *
 * When deleting a folder, it updates `deletedAt` instead of deleting the record.
 */
export const softDeleteExtension = Prisma.defineExtension((prisma) =>
	prisma.$extends({
		name: 'softDelete', // appears in logs
		query: {
			document: {
				async delete({ args, query }) {
					const { hardDelete = false } = args || {};
					if (hardDelete) {
						delete args.hardDelete;
						return query(args);
					} else {
						// mark document as deleted
						args.data = { isDeleted: true };
						return prisma.document.update(args);
					}
				},
				async deleteMany({ args, query }) {
					const { hardDelete = false } = args || {};
					if (hardDelete) {
						delete args.hardDelete;
						return query(args);
					} else {
						// mark documents as deleted
						args.data = { isDeleted: true };
						return prisma.document.updateMany(args);
					}
				}
			},
			folder: {
				async delete({ args, query }) {
					const { hardDelete = false } = args || {};
					if (hardDelete || isSeeding) {
						delete args.hardDelete;
						return query(args);
					} else {
						// mark folder as deleted
						args.data = { deletedAt: new Date() };
						return prisma.folder.update(args);
					}
				},
				async deleteMany({ args, query }) {
					const { hardDelete = false } = args || {};
					if (hardDelete || isSeeding) {
						delete args.hardDelete;
						return query(args);
					} else {
						// mark folders as deleted
						args.data = { deletedAt: new Date() };
						return prisma.folder.updateMany(args);
					}
				},
				async $allOperations({ operation, args, query }) {
					const findOrCount = operation.startsWith('find') || operation === 'count';
					if (!isSeeding && findOrCount && !args.includeDeleted) {
						// only include folders which aren't deleted
						args.where = {
							...args.where,
							deletedAt: { equals: null }
						};
					}
					return query(args);
				}
			}
		}
	})
);
