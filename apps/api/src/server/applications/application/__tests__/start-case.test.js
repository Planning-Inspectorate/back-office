import Prisma from '@prisma/client';
import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { eventClient } from '../../../infrastructure/event-client.js';
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
	reference: 'EN01-1',
	dates: {
		modifiedAt: new Date(1_669_383_489_676),
		createdAt: new Date(1_669_383_489_676)
	},
	inclusions: {
		ApplicationDetails: true,
		regions: true,
		gridReference: true
	}
});

const applicationWithMissingInformation = applicationFactoryForTests({
	id: 3,
	title: null,
	description: null,
	caseStatus: 'draft',
	reference: 'EN01-1',
	inclusions: {
		ApplicationDetails: true,
		mapZoomLevel: false,
		subSector: false,
		regions: false,
		gridReference: false
	}
});

const applicationInPreApplicationState = applicationFactoryForTests({
	id: 4,
	title: 'Title',
	description: 'Description',
	caseStatus: 'pre_application',
	reference: 'EN01-1',
	inclusions: {
		ApplicationDetails: true,
		regions: true,
		gridReference: true
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
const createFolderStub = sinon.stub();

let executeRawStub = sinon.stub();

/**
 * @type {sinon.SinonSpy<any, any>}
 */
let stubbedEventClient;

test.before('set up mocks', () => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return { findUnique: findUniqueStub, update: updateStub };
	});

	sinon.stub(databaseConnector, 'caseStatus').get(() => {
		return { updateMany: updateManyCaseStatusStub, create: createCaseStatusStub };
	});

	sinon.stub(databaseConnector, 'folder').get(() => {
		return { createMany: createFolderStub };
	});

	stubbedEventClient = sinon.stub(eventClient, 'sendEvents');

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

	sinon.assert.calledWith(createFolderStub, {
		data: [
			{ displayNameEn: 'Project management', displayOrder: 100, caseId: 1 },
			{ displayNameEn: 'Legal advice', displayOrder: 200, caseId: 1 },
			{ displayNameEn: 'Transboundary', displayOrder: 300, caseId: 1 },
			{ displayNameEn: 'Land rights', displayOrder: 400, caseId: 1 },
			{ displayNameEn: 'S51 advice', displayOrder: 500, caseId: 1 },
			{ displayNameEn: 'Pre-application', displayOrder: 600, caseId: 1 },
			{ displayNameEn: 'Acceptance', displayOrder: 700, caseId: 1 },
			{ displayNameEn: 'Pre-examination', displayOrder: 800, caseId: 1 },
			{ displayNameEn: 'Relevant representations', displayOrder: 900, caseId: 1 },
			{ displayNameEn: 'Examination', displayOrder: 1000, caseId: 1 },
			{ displayNameEn: 'Recommendation', displayOrder: 1100, caseId: 1 },
			{ displayNameEn: 'Decision', displayOrder: 1200, caseId: 1 },
			{ displayNameEn: 'Post-decision', displayOrder: 1300, caseId: 1 }
		]
	});

	let applicant;

	sinon.assert.calledWith(stubbedEventClient, 'nsip-project', [
		{
			reference: 'EN01-1',
			modifiedAt: new Date(1_669_383_489_676),
			createdAt: new Date(1_669_383_489_676),
			description: 'Description',
			publishedAt: null,
			title: 'Title',
			application: {
				locationDescription: 'Some Location',
				submissionAtPublished: 'Q1 2023',
				submissionAtInternal: new Date(1_658_486_313_000),
				caseEmail: 'test@test.com',
				subSector: {
					abbreviation: 'AA',
					name: 'sub_sector',
					sector: { name: 'sector' }
				},
				zoomLevel: { name: 'zoom-level' },
				regions: ['region1', 'region2']
			},
			applicant,
			status: { status: 'draft' },
			gridReference: { easting: 123_456, northing: 654_321 }
		}
	]);
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
			regions: 'Missing regions',
			sector: 'Missing sector',
			subSector: 'Missing subSector',
			title: 'Missing title',
			gridReferenceEasting: 'Missing gridReferenceEasting',
			gridReferenceNorthing: 'Missing gridReferenceNorthing'
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
