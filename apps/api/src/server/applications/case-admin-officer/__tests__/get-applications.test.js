import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { applicationFactoryForTests } from '../../../utils/application-factory-for-tests.js';
// import { databaseConnector } from '../../../utils/database-connector.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

const request = supertest(app);

const application = applicationFactoryForTests({
	id: 1,
	title: 'Title',
	description: 'Description',
	caseStatus: 'pre_application',
	dates: {
		modifiedAt: new Date(1_655_298_882_000)
	},
	inclusions: {
		ApplicationDetails: true,
		subSector: true
	}
});

const findManyStub = sinon.stub();

findManyStub
	.withArgs({
		orderBy: [{ ApplicationDetails: { subSector: { abbreviation: 'asc' } } }],
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
							'withdrawn',
							'published'
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

describe('Get applications', () => {
	test('gets all applications for case admin officer', async () => {
		sinon.stub(databaseConnector, 'case').get(() => {
			return { findMany: findManyStub };
		});

		const response = await request.get('/applications/case-admin-officer');

		expect(response.status).toEqual(200);

		expect(response.body).toEqual([
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
				status: 'Pre-Application',
				subSector: {
					abbreviation: 'AA',
					displayNameCy: 'Sub Sector Name Cy',
					displayNameEn: 'Sub Sector Name En',
					name: 'sub_sector'
				},
				title: 'Title'
			}
		]);
	});
});
