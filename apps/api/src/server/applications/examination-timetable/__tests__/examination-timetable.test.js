import { jest } from '@jest/globals';
import { request } from '../../../app-test.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

describe('Test examination timetable API', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});
	const mockTimetable = {
		id: 1,
		caseId: 1,
		published: true,
		publishedAt: '2024-01-01T12:00:00.000Z',
		createdAt: '2023-12-01T12:00:00.000Z',
		updatedAt: '2024-01-01T12:00:00.000Z'
	};
	describe('GET examination timetable by caseId', () => {
		test('returns 200 with timetable data for valid caseId', async () => {
			databaseConnector.examinationTimetable.findUnique.mockResolvedValue(mockTimetable);
			const response = await request.get('/applications/examination-timetable/case/1');
			expect(response.status).toBe(200);
			expect(response.body).toEqual(mockTimetable);
			expect(databaseConnector.examinationTimetable.findUnique).toHaveBeenCalledWith({
				where: { caseId: 1 }
			});
		});
		test('returns 404 if timetable not found for given caseId', async () => {
			databaseConnector.examinationTimetable.findUnique.mockResolvedValue(null);
			const response = await request.get('/applications/examination-timetable/case/999');
			expect(response.status).toBe(404);
			expect(response.body.errors).toMatch(/Examination timetable with id: 999 not found/);
			expect(databaseConnector.examinationTimetable.findUnique).toHaveBeenCalledWith({
				where: { caseId: 999 }
			});
		});
	});
});
