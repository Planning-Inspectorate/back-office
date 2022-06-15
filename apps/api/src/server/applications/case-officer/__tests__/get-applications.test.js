import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { databaseConnector } from '../../../utils/database-connector.js'

const request = supertest(app);

const application = {
    id: 1,
    reference: 'TEST REFERENCE',
    status: 'open',
    modifiedAt: new Date(1_655_298_882_000),
    subSector: {
        id: 1,
        abbreviation: 'AA',
        name: 'sub_sector',
        displayNameEn: 'Sub Sector Name En',
        displayNameCy: 'Sub Sector Name Cy',
        sector: {
            id: 1,
            abbreviation: 'BB',
            name: 'sector',
            displayNameEn: 'Sector Name En',
            displayNameCy: 'Sector Name Cy',
        }
    }
};

const findManyStub = sinon.stub();

findManyStub.withArgs({
    where: {
        status: 'open'
    },
    include: {
        subSector: {
            include: {
                sector: true
            }
        }
    }
}).returns([application])

test('gets applications for case officer with open status', async(t) => {
    sinon.stub(databaseConnector, "application").get(() => {
        return { findMany: findManyStub };
    });

    const response = await request.get('/applications/case-officer');

    t.is(response.status, 200);
    t.deepEqual(response.body, [
			{
				id: 1,
				modifiedDate: 1_655_298_882,
				reference: 'TEST REFERENCE',
				sector: {
					abbreviation: 'BB',
					displayNameCy: 'Sector Name Cy',
					displayNameEn: 'Sector Name En',
					name: 'sector'
				},
				subSector: {
					abbreviation: 'AA',
					displayNameCy: 'Sub Sector Name Cy',
					displayNameEn: 'Sub Sector Name En',
					name: 'sub_sector'
				}
			}
		]);
})
