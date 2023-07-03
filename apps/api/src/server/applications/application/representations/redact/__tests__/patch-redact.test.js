import { jest } from '@jest/globals';
import { request } from '../../../../../app-test.js';

const { databaseConnector } = await import('../../../../../utils/database-connector.js');

const existingRepresentations = [
	{
		id: 1,
		representationId: 200,
		reference: 'BC0110001-2',
		status: 'VALID',
		redacted: true,
		received: '2023-03-14T14:28:25.704Z'
	}
];

const mockDate = new Date('2023-01-02');

describe('Patch Application Representation Redact', () => {
	beforeAll(() => {
		databaseConnector.representation.findFirst.mockResolvedValue(existingRepresentations[0]);
		databaseConnector.representation.update.mockResolvedValue();
		databaseConnector.representationAction.create.mockResolvedValue();
		jest.useFakeTimers().setSystemTime(mockDate);
	});

	it('Patch representation redact', async () => {
		const response = await request
			.patch('/applications/1/representations/1/redact')
			.send({
				actionBy: 'a person',
				redactedRepresentation: 'i have been redacted',
				notes: 'This is a duplicate Rep.'
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(databaseConnector.representation.update).toHaveBeenCalledWith({
			data: { redacted: true, redactedRepresentation: 'i have been redacted' },
			where: { id: 1 }
		});

		expect(databaseConnector.representationAction.create).toHaveBeenCalledWith({
			data: {
				actionBy: 'a person',
				actionDate: mockDate,
				previousRedactStatus: true,
				notes: 'This is a duplicate Rep.',
				redactStatus: true,
				representationId: 1,
				type: 'REDACTION'
			}
		});
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			repId: 1,
			redacted: true
		});
	});

	it('Patch representation redact - invalid request - missing mandatory field', async () => {
		const response = await request
			.patch('/applications/1/representations/1/redact')
			.send({})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				actionBy: 'is a mandatory field',
				redactedRepresentation: 'is a mandatory field'
			}
		});
	});

	it('Patch representation redact - invalid request - Must be a valid status', async () => {
		const response = await request
			.patch('/applications/1/representations/1/redact')
			.send({ actionBy: 'a person', redactedRepresentation: 'a valid rep', type: 'bad type' })
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				type: 'Must be a valid type of: REDACTION,STATUS,REDACT_STATUS'
			}
		});
	});
	it('Patch representation redact - invalid request - redactStatus', async () => {
		const response = await request
			.patch('/applications/1/representations/1/redact')
			.send({ actionBy: 'a person', redactStatus: 'a valid rep', type: 'REDACT_STATUS' })
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				redactStatus: 'Invalid value'
			}
		});
	});
});
