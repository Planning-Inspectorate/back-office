import { request } from '#app-test';
import { applicationFactoryForTests } from '#utils/application-factory-for-tests.js';
const { databaseConnector } = await import('#utils/database-connector.js');
import { featureFlagClient } from '#utils/feature-flags.js';

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

let trainingCase = applicationFactoryForTests({
	id: 2,
	title: 'A Training Case',
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
if (trainingCase.ApplicationDetails) {
	trainingCase.ApplicationDetails.subSectorId = 26;

	trainingCase.ApplicationDetails.subSector = {
		id: 26,
		abbreviation: 'TRAIN01',
		name: 'training',
		displayNameEn: 'Training',
		displayNameCy: 'Training',
		sectorId: 7,
		sector: {
			id: 7,
			abbreviation: 'TRAIN',
			name: 'training',
			displayNameEn: 'Training',
			displayNameCy: 'Training'
		}
	};
}

describe('Get applications', () => {
	test('gets all applications', async () => {
		// GIVEN
		databaseConnector.case.findMany.mockResolvedValue([application]);

		// WHEN
		const response = await request.get('/applications');

		// THEN
		expect(response.status).toEqual(200);

		expect(response.body).toHaveLength(1);
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

	if (featureFlagClient.isFeatureActive('applics-1036-training-sector')) {
		test('gets all applications - Training Feature Flag ON', async () => {
			// GIVEN
			databaseConnector.case.findMany.mockResolvedValue([trainingCase]);

			// WHEN
			const response = await request.get('/applications');

			// THEN
			expect(response.status).toEqual(200);
			expect(response.body).toHaveLength(1);
		});
	} else {
		// Feature Flag TRAINING not active
		test('gets all applications - Training Feature Flag OFF', async () => {
			// GIVEN
			databaseConnector.case.findMany.mockResolvedValue([]);

			// WHEN
			const response = await request.get('/applications');

			// THEN
			expect(response.status).toEqual(200);
			expect(response.body).toEqual([]); // no training case returned
		});
	}
});
