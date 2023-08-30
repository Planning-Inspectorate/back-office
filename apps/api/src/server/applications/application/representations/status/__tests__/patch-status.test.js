import { jest } from '@jest/globals';
import { request } from '../../../../../app-test.js';
import { eventClient } from '#infrastructure/event-client.js';

const { databaseConnector } = await import('../../../../../utils/database-connector.js');

const existingRepresentations = [
	{
		id: 1,
		caseId: 1,
		reference: 'BC0110001-2',
		status: 'VALID',
		redacted: true,
		received: '2023-03-14T14:28:25.704Z'
	},
	{
		id: 2,
		caseId: 1,
		reference: 'BC0110001-55',
		status: 'PUBLISHED',
		redacted: true,
		received: '2023-08-11T10:52:56.516Z'
	}
];

const expectedUnpublishPayload = {
	representationId: 2,
	status: 'VALID'
};
const mockDate = new Date('2023-01-02');

describe('Patch Application Representation Status', () => {
	beforeAll(() => {
		databaseConnector.representation.findFirst.mockResolvedValue(existingRepresentations[0]);
		databaseConnector.representation.findMany.mockResolvedValue(existingRepresentations);
		databaseConnector.representation.update.mockResolvedValue();
		databaseConnector.representationAction.create.mockResolvedValue();
		jest.useFakeTimers().setSystemTime(mockDate);
	});

	it('Patch representation status', async () => {
		const response = await request
			.patch('/applications/1/representations/1/status')
			.send({
				actionBy: 'a person',
				status: 'INVALID',
				invalidReason: 'Duplicate',
				notes: 'the rep has been redacted',
				updatedBy: 'jim bo'
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(databaseConnector.representation.update).toHaveBeenCalledWith({
			data: { status: 'INVALID' },
			where: { id: 1 }
		});
		expect(databaseConnector.representationAction.create).toHaveBeenCalledWith({
			data: {
				actionBy: 'jim bo',
				actionDate: mockDate,
				invalidReason: 'Duplicate',
				notes: 'the rep has been redacted',
				previousStatus: 'VALID',
				representationId: 1,
				status: 'INVALID',
				type: 'STATUS'
			}
		});
		expect(eventClient.sendEvents).not.toHaveBeenCalled();
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			repId: 1
		});
	});

	it('Patch representation status - invalid request - missing mandatory field', async () => {
		const response = await request
			.patch('/applications/1/representations/1/status')
			.send({})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				status: 'Invalid value',
				updatedBy: 'is a required field'
			}
		});
	});

	it('Patch representation status - invalid request - status = INVALID', async () => {
		const response = await request
			.patch('/applications/1/representations/1/status')
			.send({
				updatedBy: 'a person',
				status: 'INVALID'
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				status: 'INVALID status requires invalidReason'
			}
		});
	});

	it('Patch representation status - invalid request - status = REFERRED', async () => {
		const response = await request
			.patch('/applications/1/representations/1/status')
			.send({
				updatedBy: 'a person',
				status: 'REFERRED'
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				status: 'REFERRED status requires referredTo'
			}
		});
	});

	it('Patch representation status - invalid request - status, invalidReason, referredTo', async () => {
		const response = await request
			.patch('/applications/1/representations/1/status')
			.send({
				updatedBy: 'a person',
				invalidReason: 'i did not feel like it',
				referredTo: 'myself'
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				status: 'Invalid value',
				invalidReason: 'Must be a valid: Duplicate,Merged,Not relevant,Resubmitted,Test',
				referredTo: 'Must be a valid: Case Team,Inspector,Central Admin Team,Interested Party'
			}
		});
	});

	it('Patch representation status from PUBLISHED to VALID', async () => {
		databaseConnector.representation.findFirst.mockResolvedValue(existingRepresentations[1]);

		const response = await request
			.patch('/applications/1/representations/2/status')
			.send({
				status: 'VALID',
				notes: 'unpublishing rep',
				updatedBy: 'jim bo'
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');

		expect(databaseConnector.representation.update).toHaveBeenCalledWith({
			data: { status: 'VALID', unpublishedUpdates: false },
			where: { id: 2 }
		});
		expect(databaseConnector.representationAction.create).toHaveBeenCalledWith({
			data: {
				actionBy: 'jim bo',
				actionDate: mockDate,
				notes: 'unpublishing rep',
				previousStatus: 'PUBLISHED',
				representationId: 2,
				status: 'VALID',
				type: 'STATUS'
			}
		});
		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			'nsip-representation',
			expectedUnpublishPayload,
			'Update'
		);
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			repId: 2
		});
	});
});
