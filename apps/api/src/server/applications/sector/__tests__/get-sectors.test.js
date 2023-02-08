import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
// import { databaseConnector } from '../../../utils/database-connector.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

const request = supertest(app);

/**
 * @type {import('@pins/api').Schema.Sector}
 */
const sector = {
	id: 1,
	name: 'test name',
	abbreviation: 'AA',
	displayNameEn: 'test name en',
	displayNameCy: 'test name cy'
};

const unknownSectorName = 'some-unknown-sector';

/**
 * @type {import('@pins/api').Schema.SubSector}
 */
const subSector = {
	id: 2,
	name: 'test subSector name',
	abbreviation: 'BB',
	displayNameEn: 'test subsector name en',
	displayNameCy: 'test subsector name cy',
	sector,
	sectorId: 0
};

const findManySectorsStub = sinon.stub().withArgs({}).returns([sector]);
const findManySubSectorStub = sinon.stub();

findManySubSectorStub
	.withArgs({
		where: {
			sector: {
				name: sector.name
			}
		}
	})
	.returns([subSector]);
findManySubSectorStub
	.withArgs({
		where: {
			sector: {
				name: unknownSectorName
			}
		}
	})
	.returns([]);

const findUniqueSectorStub = sinon.stub();

findUniqueSectorStub.withArgs({ where: { name: sector.name } }).returns(sector);
findUniqueSectorStub.withArgs({ where: { name: unknownSectorName } }).returns(null);

describe('Get sectors', () => {
	beforeAll(() => {
		sinon.stub(databaseConnector, 'sector').get(() => {
			return { findMany: findManySectorsStub, findUnique: findUniqueSectorStub };
		});
		sinon.stub(databaseConnector, 'subSector').get(() => {
			return { findMany: findManySubSectorStub };
		});
	});

	test('gets all sectors', async () => {
		const response = await request.get('/applications/sector');

		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				name: sector.name,
				abbreviation: sector.abbreviation,
				displayNameEn: sector.displayNameEn,
				displayNameCy: sector.displayNameCy
			}
		]);
	});

	test('gets all sub-sectors associated with existing sector', async () => {
		const response = await request
			.get('/applications/sector')
			.query({ sectorName: subSector.sector.name });

		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				name: subSector.name,
				abbreviation: subSector.abbreviation,
				displayNameEn: subSector.displayNameEn,
				displayNameCy: subSector.displayNameCy
			}
		]);
	});

	test('fails to get any subsectors when an unknown sector name is provided', async () => {
		const response = await request
			.get('/applications/sector')
			.query({ sectorName: unknownSectorName });

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				sectorName: 'Sector name not recognised'
			}
		});
	});
});
