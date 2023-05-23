import { jest } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../../../../../app.js';

const { databaseConnector } = await import('../../../../../utils/database-connector.js');

const request = supertest(app);

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
				redactedRepresentation: 'i have been redacted'
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

		expect(response.status).toEqual(404);
		expect(response.body).toEqual({
			errors: {
				actionBy: 'is a mandatory field',
				redactedRepresentation: 'is a mandatory field'
			}
		});
	});
});
