import { jest } from '@jest/globals';
import { modifyPrismaDocumentQueryMiddleware } from '../prisma-middleware/index.js';

const nextFunctionStub = jest.fn();

beforeEach(() => {
	nextFunctionStub.mockRestore();
});

test('modifyPrismaDocumentQueryMiddleware() testing delete action should convert action to update', () => {
	// GIVEN
	/** @type {Partial<import('@prisma/client').Prisma.MiddlewareParams>} */
	const parameters = {
		action: 'delete',
		model: 'Document',
		args: {
			data: {},
			where: {}
		}
	};

	// WHEN
	// @ts-ignore
	modifyPrismaDocumentQueryMiddleware(parameters, nextFunctionStub);

	// THEN
	expect(nextFunctionStub).toHaveBeenCalledTimes(1);
	expect(parameters.action).toEqual('update');
	expect(parameters.args.data.isDeleted).toEqual(true);
});

test('modifyPrismaDocumentQueryMiddleware() testing findFirst action', () => {
	// GIVEN
	/** @type {Partial<import('@prisma/client').Prisma.MiddlewareParams>} */
	const parameters = {
		action: 'findFirst',
		model: 'Document',
		args: {
			data: {},
			where: {}
		}
	};

	// WHEN
	// @ts-ignore
	modifyPrismaDocumentQueryMiddleware(parameters, nextFunctionStub);

	// THEN
	expect(nextFunctionStub).toHaveBeenCalledTimes(1);

	expect(parameters.action).toEqual('findFirst');
	expect(parameters.args.where.isDeleted).toEqual(false);
});

test('modifyPrismaDocumentQueryMiddleware() testing count action', () => {
	// GIVEN
	/** @type {Partial<import('@prisma/client').Prisma.MiddlewareParams>} */
	const parameters = {
		action: 'count',
		model: 'Document',
		args: {
			data: {},
			where: {}
		}
	};

	// WHEN
	// @ts-ignore
	modifyPrismaDocumentQueryMiddleware(parameters, nextFunctionStub);

	// THEN
	expect(nextFunctionStub).toHaveBeenCalledTimes(1);
	expect(parameters.action).toEqual('count');
	expect(parameters.args.where.isDeleted).toEqual(false);
});

test('modifyPrismaDocumentQueryMiddleware() testing findUnique action should convert action to findFirst', () => {
	// GIVEN
	/** @type {Partial<import('@prisma/client').Prisma.MiddlewareParams>} */
	const parameters = {
		action: 'findUnique',
		model: 'Document',
		args: {
			data: {},
			where: {}
		}
	};

	// WHEN
	// @ts-ignore
	modifyPrismaDocumentQueryMiddleware(parameters, nextFunctionStub);

	// THEN
	expect(nextFunctionStub).toHaveBeenCalledTimes(1);
	expect(parameters.action).toEqual('findFirst');
	expect(parameters.args.where.isDeleted).toEqual(false);
});

test('modifyPrismaDocumentQueryMiddleware() testing findMany action when isDeleted is included', () => {
	// GIVEN
	/** @type {Partial<import('@prisma/client').Prisma.MiddlewareParams>} */
	const parameters = {
		action: 'findMany',
		model: 'Document',
		args: {
			data: {},
			where: {
				isDeleted: true
			}
		}
	};

	// WHEN
	// @ts-ignore
	modifyPrismaDocumentQueryMiddleware(parameters, nextFunctionStub);

	// THEN
	expect(nextFunctionStub).toHaveBeenCalledTimes(1);

	expect(parameters.action).toEqual('findMany');
	expect(parameters.args.where.isDeleted).toEqual(true);
});

test('modifyPrismaDocumentQueryMiddleware() testing findMany action when isDeleted is not included', () => {
	// GIVEN
	/** @type {Partial<import('@prisma/client').Prisma.MiddlewareParams>} */
	const parameters = {
		action: 'findMany',
		model: 'Document',
		args: {
			data: {},
			where: {}
		}
	};

	// WHEN
	// @ts-ignore
	modifyPrismaDocumentQueryMiddleware(parameters, nextFunctionStub);

	// THEN
	expect(nextFunctionStub).toHaveBeenCalledTimes(1);

	expect(parameters.action).toEqual('findMany');
	expect(parameters.args.where.isDeleted).toEqual(false);
});
