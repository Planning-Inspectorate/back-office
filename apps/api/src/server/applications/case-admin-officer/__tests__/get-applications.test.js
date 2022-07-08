import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { applicationFactoryForTests } from '../../../utils/application-factory-for-tests.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const request = supertest(app);

const application = applicationFactoryForTests({
	id: 1,
	status: 'open',
	modifiedAt: new Date(1_655_298_882_000)
});

const findManyStub = sinon.stub();

findManyStub
	.withArgs({
		where: {
			CaseStatus: {
				some: {
					status: 'open',
					valid: true
				}
			}
		},
		include: {
			ApplicationDetails: {
				include: {
					subSector: {
						include: {
							sector: true
						}
					}
				}
			}
		}
	})
	.returns([application]);

test('gets applications for case officer with open status', async (t) => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return { findMany: findManyStub };
	});

	const response = await request.get('/applications/case-admin-officer');

	t.is(response.status, 200);
	t.deepEqual(response.body, [
		{
			id: 1,
			modifiedDate: 1_655_298_882,
			reference: application.reference,
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
});
