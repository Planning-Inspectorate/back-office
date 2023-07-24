import { request } from '#app-test';
import { expectedCSVStringTest } from '../__fixtures__/expected-csv-string-120.js';
import { existingRepresentationsTestData } from '../__fixtures__/existing-representations.js';
const { databaseConnector } = await import('../../../../../utils/database-connector.js');

describe('Get Application Representation Download', () => {
	it('representation has an agent', async () => {
		databaseConnector.representation.findMany.mockResolvedValue([existingRepresentationsTestData]);

		const response = await request.get('/applications/1/representations/download');

		expect(response.status).toEqual(200);
		expect(response.headers['content-disposition']).toEqual('attachment; filename=output.csv');
		expect(response.headers['content-type']).toEqual('text/csv; charset=utf-8');
		// This is the text for the CSV string
		expect(response.text).toEqual(
			'IP number,On behalf of,Email Address,address line 1,address line 2,address line 3,address line 4,address line 5,address line 6,postcode,Email or Post?\n' +
				'BC0110001-36,James Test,test-agent@example.com,James Bond,Copthalls Clevedon Road,West Hill,,,,BS48 1PN,\n'
		);
	});

	it('gets rep download for a case by id - test 120 reps', async () => {
		// first response return 100 to trigger another batch run (while has more)
		// second response is less than 100 to trigger the end of the batching
		databaseConnector.representation.findMany
			.mockResolvedValueOnce(Array(100).fill(existingRepresentationsTestData))
			.mockResolvedValueOnce(Array(20).fill(existingRepresentationsTestData));

		const response = await request.get('/applications/1/representations/download');

		expect(response.status).toEqual(200);
		expect(response.headers['content-disposition']).toEqual('attachment; filename=output.csv');
		expect(response.headers['content-type']).toEqual('text/csv; charset=utf-8');
		// This is the text for the CSV string
		expect(response.text).toEqual(expectedCSVStringTest);
	});
});
