import supertest from 'supertest';
import { app } from '../../../app.js';
import { applicationFactoryForTests } from '../../../utils/application-factory-for-tests.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

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

describe('Get applications', () => {
	test('gets all applications for case team', async () => {
		// GIVEN
		databaseConnector.case.findMany.mockResolvedValue([application]);

		// WHEN
		const response = await request.get('/applications/case-team');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
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
});
