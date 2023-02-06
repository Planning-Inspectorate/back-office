import { Prisma } from '@prisma/client';
import test from 'ava';
import sinon from 'sinon';
import { prismaClientDocumentMiddleWare } from '../prisma-middleware.js';

const sandbox = sinon.createSandbox();

/** @type {import('sinon').SinonStub<any, Promise<any>>} */
const nextFunctionStub = sandbox.stub();

test.afterEach.always(() => {
	sandbox.reset();
	sandbox.resetBehavior();
});

test.serial(
	'prismaClientDocumentMiddleWare() testing delete action should convert action to update',
	(t) => {
		/** @type {Partial<Prisma.MiddlewareParams>} */
		const parameters = {
			action: 'delete',
			model: Prisma.ModelName.Document,
			args: {
				data: {},
				where: {}
			}
		};

		// @ts-ignore
		prismaClientDocumentMiddleWare(parameters, nextFunctionStub);

		sinon.assert.callCount(nextFunctionStub, 1);

		t.deepEqual(parameters.action, 'update');
		t.deepEqual(parameters.args.data.isDeleted, true);
	}
);

test.serial('prismaClientDocumentMiddleWare() testing findFirst action', (t) => {
	/** @type {Partial<Prisma.MiddlewareParams>} */
	const parameters = {
		action: 'findFirst',
		model: Prisma.ModelName.Document,
		args: {
			data: {},
			where: {}
		}
	};

	// @ts-ignore
	prismaClientDocumentMiddleWare(parameters, nextFunctionStub);

	sinon.assert.callCount(nextFunctionStub, 1);

	t.deepEqual(parameters.action, 'findFirst');
	t.deepEqual(parameters.args.where.isDeleted, false);
});

test.serial('prismaClientDocumentMiddleWare() testing count action', (t) => {
	/** @type {Partial<Prisma.MiddlewareParams>} */
	const parameters = {
		action: 'count',
		model: Prisma.ModelName.Document,
		args: {
			data: {},
			where: {}
		}
	};

	// @ts-ignore
	prismaClientDocumentMiddleWare(parameters, nextFunctionStub);

	sinon.assert.callCount(nextFunctionStub, 1);

	t.deepEqual(parameters.action, 'count');
	t.deepEqual(parameters.args.where.isDeleted, false);
});

test.serial(
	'prismaClientDocumentMiddleWare() testing findUnique action should convert action to findFirst',
	(t) => {
		/** @type {Partial<Prisma.MiddlewareParams>} */
		const parameters = {
			action: 'findUnique',
			model: Prisma.ModelName.Document,
			args: {
				data: {},
				where: {}
			}
		};

		// @ts-ignore
		prismaClientDocumentMiddleWare(parameters, nextFunctionStub);

		sinon.assert.callCount(nextFunctionStub, 1);

		t.deepEqual(parameters.action, 'findFirst');
		t.deepEqual(parameters.args.where.isDeleted, false);
	}
);

test.serial(
	'prismaClientDocumentMiddleWare() testing findMany action when isDeleted is included',
	(t) => {
		/** @type {Partial<Prisma.MiddlewareParams>} */
		const parameters = {
			action: 'findMany',
			model: Prisma.ModelName.Document,
			args: {
				data: {},
				where: {
					isDeleted: true
				}
			}
		};

		// @ts-ignore
		prismaClientDocumentMiddleWare(parameters, nextFunctionStub);

		sinon.assert.callCount(nextFunctionStub, 1);

		t.deepEqual(parameters.action, 'findMany');
		t.deepEqual(parameters.args.where.isDeleted, true);
	}
);

test.serial(
	'prismaClientDocumentMiddleWare() testing findMany action when isDeleted is not included',
	(t) => {
		/** @type {Partial<Prisma.MiddlewareParams>} */
		const parameters = {
			action: 'findMany',
			model: Prisma.ModelName.Document,
			args: {
				data: {},
				where: {}
			}
		};

		// @ts-ignore
		prismaClientDocumentMiddleWare(parameters, nextFunctionStub);

		sinon.assert.callCount(nextFunctionStub, 1);

		t.deepEqual(parameters.action, 'findMany');
		t.deepEqual(parameters.args.where.isDeleted, false);
	}
);
