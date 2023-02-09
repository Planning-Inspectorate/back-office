import supertest from 'supertest';
import { app } from '../../../app.js';
import { applicationFactoryForTests } from '../../../utils/application-factory-for-tests.js';
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

describe('Get applications', () => {
	test('gets all applications for case admin officer', async () => {
		// GIVEN
		databaseConnector.case.findMany.mockResolvedValue([application]);

		// WHEN
		const response = await request.get('/applications/case-admin-officer');

		// THEN
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
