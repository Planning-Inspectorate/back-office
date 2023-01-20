import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { applicationFactoryForTests } from '../../../utils/application-factory-for-tests.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const request = supertest(app);

const application = applicationFactoryForTests({
	id: 1,
	title: 'Title',
	description: 'Description',
	caseStatus: 'draft',
	dates: { modifiedAt: new Date(1_655_298_882_000) },
	inclusions: {
		ApplicationDetails: true,
		subSector: true
	}
});

const findManyStub = sinon.stub();

findManyStub
	.withArgs({
		orderBy: [{ id: 'asc' }, { ApplicationDetails: { subSector: { abbreviation: 'asc' } } }],
		where: {
			CaseStatus: {
				some: {
					status: {
						in: [
							'draft',
							'pre_application',
							'acceptance',
							'pre_examination',
							'examination',
							'recommendation',
							'decision',
							'post_decision',
							'withdrawn'
						]
					},
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
			},
			CaseStatus: {
				where: {
					valid: true
				}
			}
		}
	})
	.returns([application]);

test('gets all applications for Case team', async (t) => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return { findMany: findManyStub };
	});

	const response = await request.get('/applications/case-team');

	t.is(response.status, 200);
	t.deepEqual(response.body, [
		{
			id: 1,
			title: 'Title',
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
			},
			status: 'Draft'
		}
	]);
});
