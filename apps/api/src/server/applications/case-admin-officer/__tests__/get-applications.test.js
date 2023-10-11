import { request } from '../../../app-test.js';
import { applicationFactoryForTests } from '#utils/application-factory-for-tests.js';
const { databaseConnector } = await import('#utils/database-connector.js');

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
					name: 'business_and_commercial',
					abbreviation: 'BC',
					displayNameEn: 'Business and Commercial',
					displayNameCy: 'Business and Commercial'
				},
				status: 'Pre-Application',
				subSector: {
					name: 'office_use',
					abbreviation: 'BC01',
					displayNameEn: 'Office Use',
					displayNameCy: 'Office Use'
				},
				title: 'Title'
			}
		]);
	});
});
