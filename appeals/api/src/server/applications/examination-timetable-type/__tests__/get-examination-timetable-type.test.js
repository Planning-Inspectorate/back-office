import { jest } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../../../app-test.js';
import { nodeCache, setCache } from '../../../utils/cache-data.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');

const request = supertest(app);

const examinationTimetableTypes = {
	id: 1,
	name: 'Accompanied Site Inspection',
	templateType: 'starttime-optional',
	displayNameEn: 'Accompanied site inspection',
	displayNameCy: 'Accompanied site inspection Cy'
};

describe('Get examination timetable types', () => {
	beforeEach(() => {
		nodeCache.flushAll();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	test('gets all examination timetable types', async () => {
		// GIVEN
		databaseConnector.examinationTimetableType.findMany.mockResolvedValue([
			examinationTimetableTypes
		]);

		// WHEN
		const resp = await request.get('/applications/examination-timetable-type');

		// THEN
		expect(resp.status).toEqual(200);
		expect(resp.body).toEqual([
			{
				id: examinationTimetableTypes.id,
				name: examinationTimetableTypes.name,
				templateType: examinationTimetableTypes.templateType,
				displayNameEn: examinationTimetableTypes.displayNameEn,
				displayNameCy: examinationTimetableTypes.displayNameCy
			}
		]);
	});
});

test('tests if cached data for examination-timetable-type call is returned without hitting db', async () => {
	const cachedExaminationTimetableTypes = {
		id: 2,
		name: 'cached test',
		templateType: 'cached templateType',
		displayNameEn: 'cached test name en',
		displayNameCy: 'cached test name cy'
	};

	setCache('examination-timetable-type', [cachedExaminationTimetableTypes]);

	const resp = await request.get('/applications/examination-timetable-type');

	expect(databaseConnector.examinationTimetableType.findMany).not.toHaveBeenCalled();
	expect(resp.status).toEqual(200);
	expect(resp.body).toEqual([
		{
			id: cachedExaminationTimetableTypes.id,
			name: cachedExaminationTimetableTypes.name,
			templateType: cachedExaminationTimetableTypes.templateType,
			displayNameEn: cachedExaminationTimetableTypes.displayNameEn,
			displayNameCy: cachedExaminationTimetableTypes.displayNameCy
		}
	]);
});
