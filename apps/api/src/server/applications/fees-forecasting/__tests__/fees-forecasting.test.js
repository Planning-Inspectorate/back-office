import { request } from '#app-test';
const { databaseConnector } = await import('#utils/database-connector.js');
import { jest } from '@jest/globals';

const updatedData = {
	memLastUpdated: '2025-09-20T00:00:00.000Z',
	newMaturity: null,
	numberBand2Inspectors: null
};

describe('Fees and Forecasting API Endpoints', () => {
	beforeEach(() => {
		databaseConnector.case.update?.mockReset?.();
	});

	describe('PATCH / applications/:id/fees-forecasting/:sectionName', () => {
		const updatePayload = {
			memLastUpdated: '2025-09-20T00:00:00.000Z'
		};

		it('should update a specific case', async () => {
			const mockDate = new Date(2023, 1, 1);
			jest.useFakeTimers().setSystemTime(mockDate);

			databaseConnector.case.update.mockResolvedValueOnce({ ApplicationDetails: updatedData });

			const res = await request
				.patch('/applications/100000000/fees-forecasting/maturity-evaluation-matrix')
				.send(updatePayload);

			expect(res.status).toBe(200);
			expect(databaseConnector.case.update).toHaveBeenCalledWith({
				where: { id: 100000000 },
				data: {
					modifiedAt: new Date(2023, 1, 1),
					ApplicationDetails: {
						update: {
							memLastUpdated: '2025-09-20T00:00:00.000Z'
						}
					}
				},
				select: {
					ApplicationDetails: true
				}
			});
			expect(res.body).toEqual(updatedData);

			jest.runAllTimers();
			jest.useRealTimers();
		});

		it('should return 404 if the case could not be found', async () => {
			databaseConnector.case.update.mockRejectedValueOnce(
				Object.assign(new Error('Record not found'), { code: 'P2025' })
			);

			const res = await request
				.patch(`/applications/100000001/fees-forecasting/maturity-evaluation-matrix`)
				.send(updatePayload);

			expect(res.status).toBe(404);
			expect(res.body).toEqual({
				errors: 'Case 100000001 not found'
			});
		});

		it('should return 500 if the case could not be updated', async () => {
			databaseConnector.case.update.mockResolvedValueOnce(null);

			const res = await request
				.patch('/applications/100000000/fees-forecasting/maturity-evaluation-matrix')
				.send(updatePayload);

			expect(res.status).toBe(500);
			expect(res.body).toEqual({
				errors: `Error updating case 100000000`
			});
		});
	});
});
