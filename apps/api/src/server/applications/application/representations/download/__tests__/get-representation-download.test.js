import { request } from '#app-test';
import {
	expectedCSVStringTest,
	expectedValidCSVStringTest
} from '../__fixtures__/expected-csv-string-120.js';
import { existingRepresentationsTestData } from '../__fixtures__/existing-representations.js';
import { jest } from '@jest/globals';
const { databaseConnector } = await import('../../../../../utils/database-connector.js');

describe('Get Application Representation Download', () => {
	beforeAll(() => {
		jest.useFakeTimers({ doNotFake: ['performance'] });
		jest.setSystemTime(new Date('2020-01-01'));
	});
	it('representation has a single valid rep', async () => {
		databaseConnector.representation.findMany.mockResolvedValue([existingRepresentationsTestData]);

		const response = await request.get('/applications/1/representations/download/published');

		expect(response.status).toEqual(200);
		expect(response.headers['content-disposition']).toEqual(
			'attachment; filename=mailing-list-1-2020-01-01-00_00_00.csv'
		);
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

		// jest.useFakeTimers({ doNotFake: ['performance'] }).setSystemTime(new Date('2020-01-01'));

		const response = await request.get('/applications/1/representations/download/published');

		expect(response.status).toEqual(200);
		expect(response.headers['content-disposition']).toEqual(
			'attachment; filename=mailing-list-1-2020-01-01-00_00_00.csv'
		);
		expect(response.headers['content-type']).toEqual('text/csv; charset=utf-8');
		// This is the text for the CSV string
		expect(response.text).toEqual(expectedCSVStringTest);
	});

	it('representation has a single valid rep (valid endpoint)', async () => {
		databaseConnector.representation.findMany.mockResolvedValue([existingRepresentationsTestData]);

		const response = await request.get('/applications/1/representations/download/valid');

		expect(response.status).toEqual(200);
		expect(response.headers['content-disposition']).toEqual(
			'attachment; filename=relevant-reps-1-2020-01-01-00_00_00.csv'
		);
		expect(response.headers['content-type']).toEqual('text/csv; charset=utf-8');
		expect(response.text).toEqual(
			'Name,Postcode,Attachments,IP number,Status,Action Date,Representation\n' +
				'James Bond,BS48 1PN,Yes,BC0110001-36,VALID,2020-01-01T12:00:00.000Z,Edited comment for valid rep\n'
		);
	});

	it('gets rep download for a case by id - test 120 reps (valid endpoint)', async () => {
		databaseConnector.representation.findMany
			.mockResolvedValueOnce(Array(100).fill(existingRepresentationsTestData))
			.mockResolvedValueOnce(Array(20).fill(existingRepresentationsTestData));

		const response = await request.get('/applications/1/representations/download/valid');

		expect(response.status).toEqual(200);
		expect(response.headers['content-disposition']).toEqual(
			'attachment; filename=relevant-reps-1-2020-01-01-00_00_00.csv'
		);
		expect(response.headers['content-type']).toEqual('text/csv; charset=utf-8');
		expect(response.text).toEqual(expectedValidCSVStringTest);
	});
});
