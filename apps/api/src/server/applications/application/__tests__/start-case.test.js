import Prisma from '@prisma/client';
import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { applicationFactoryForTests } from '../../../utils/application-factory-for-tests.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const request = supertest(app);

const findUniqueStub = sinon.stub();

const referenceSettingSqlQuery =
	'declare @sub_sector_abbreviation nchar(4), @max_reference int, @reference_number int;declare @minimum_new_reference int = 10001;declare @id int = 1;select @sub_sector_abbreviation = sub_sector_table.abbreviation FROM [dbo].[Case] as case_table     join [dbo].[ApplicationDetails] as application_details_table     on case_table.id = application_details_table.caseId     join [dbo].[SubSector] as sub_sector_table     on application_details_table.subSectorId = sub_sector_table.id where case_table.id = @id; SELECT @max_reference = max(cast(SUBSTRING(case_table.reference, 5, len(case_table.reference)) as int)) FROM [dbo].[Case] as case_table     join [dbo].[ApplicationDetails] as application_details_table     on case_table.id = application_details_table.caseId     join [dbo].[SubSector] as sub_sector_table     on application_details_table.subSectorId = sub_sector_table.id         and sub_sector_table.abbreviation = @sub_sector_abbreviation; if(@max_reference < @minimum_new_reference) select @reference_number = @minimum_new_reference else select @reference_number = @max_reference + 1;update [dbo].[Case]     set reference = @sub_sector_abbreviation + cast(@reference_number as nchar(5))     where id = @id;';

const applicationReadyToStart = applicationFactoryForTests({
	id: 1,
	title: 'Title',
	description: 'Description',
	caseStatus: 'draft',
	inclusions: {
		ApplicationDetails: true,
		regions: true
	}
});

const applicationWithMissingInformation = applicationFactoryForTests({
	id: 3,
	title: null,
	description: null,
	caseStatus: 'draft',
	inclusions: {
		ApplicationDetails: true,
		mapZoomLevel: false,
		subSector: false,
		regions: false
	}
});

const applicationInPreApplicationState = applicationFactoryForTests({
	id: 4,
	title: 'Title',
	description: 'Description',
	caseStatus: 'pre_application',
	inclusions: {
		ApplicationDetails: true,
		regions: true
	}
});

findUniqueStub.withArgs({ where: { id: 1 } }).returns(applicationReadyToStart);
findUniqueStub
	.withArgs({ where: { id: 1 }, include: sinon.match.any })
	.returns(applicationReadyToStart);
findUniqueStub.withArgs({ where: { id: 2 } }).returns(null);
findUniqueStub.withArgs({ where: { id: 3 } }).returns(applicationWithMissingInformation);
findUniqueStub
	.withArgs({ where: { id: 3 }, include: sinon.match.any })
	.returns(applicationWithMissingInformation);
findUniqueStub.withArgs({ where: { id: 4 } }).returns(applicationInPreApplicationState);
findUniqueStub
	.withArgs({ where: { id: 4 }, include: sinon.match.any })
	.returns(applicationInPreApplicationState);

const updateStub = sinon.stub();
const updateManyCaseStatusStub = sinon.stub();
const createCaseStatusStub = sinon.stub();

let executeRawStub = sinon.stub();

test.before('set up mocks', () => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return { findUnique: findUniqueStub, update: updateStub };
	});

	sinon.stub(databaseConnector, 'caseStatus').get(() => {
		return { updateMany: updateManyCaseStatusStub, create: createCaseStatusStub };
	});

	sinon.stub(Prisma.PrismaClient.prototype, '$transaction');
	executeRawStub = sinon.stub(Prisma.PrismaClient.prototype, '$executeRawUnsafe');
	sinon.useFakeTimers({ now: 1_649_319_144_000 });
});

test('starts application if all needed information is present', async (t) => {
	const response = await request.post('/applications/1/start');

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		id: 1,
		reference: applicationReadyToStart.reference,
		status: 'Pre-Application'
	});

	sinon.assert.calledWith(updateManyCaseStatusStub, {
		where: { id: { in: [1] } },
		data: { valid: false }
	});

	sinon.assert.calledWith(createCaseStatusStub, { data: { status: 'pre_application', caseId: 1 } });

	sinon.assert.notCalled(updateStub);

	sinon.assert.calledWith(executeRawStub, referenceSettingSqlQuery);
});

test('throws an error if the application id is not recognised', async (t) => {
	const response = await request.post('/applications/2/start');

	t.is(response.status, 404);
	t.deepEqual(response.body, {
		errors: {
			id: 'Must be an existing application'
		}
	});
});

test('throws an error if the application does not have all the required information to start', async (t) => {
	const response = await request.post('/applications/3/start');

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			description: 'Missing description',
			mapZoomLevel: 'Missing mapZoomLevel',
			regions: 'Missing regions',
			subSector: 'Missing subSector',
			title: 'Missing title'
		}
	});
});

test('throws an error if the application is not in draft state', async (t) => {
	const response = await request.post('/applications/4/start');

	t.is(response.status, 409);
	t.deepEqual(response.body, {
		errors: {
			application: "Could not transition 'pre_application' using 'START'."
		}
	});
});
