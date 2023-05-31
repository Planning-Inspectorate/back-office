import { jest } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../../../app-test.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');

const request = supertest(app);

const examinationTimetableItem = {
	id: 1,
	caseId: 1,
	examinationTypeId: 1,
	name: 'Exmaination Timetable Item',
	description: 'Exmaination Timetable Item Description',
	date: '2023-02-27T10:00:00Z',
	startDate: '2023-02-27T10:00:00Z',
	startTime: '10:20',
	endDate: '2023-02-27T12:00:00Z',
	endTime: '12:20',
	ExaminationTimetableType: {
		id: 2,
		name: 'Compulsory Acquisition Hearing',
		templateType: 'starttime-mandatory',
		displayNameEn: 'Compulsory acquisition hearing',
		displayNameCy: 'Compulsory acquisition hearing'
	}
};

describe('Test examination timetable items API', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	test('gets all examination timetable items for case', async () => {
		databaseConnector.examinationTimetableItems.findMany.mockResolvedValue([
			examinationTimetableItem
		]);
		const resp = await request.get('/applications/examination-timetable-items/case/1');
		expect(resp.status).toEqual(200);
		expect(databaseConnector.examinationTimetableItems.findMany).toHaveBeenCalledWith({
			include: { ExaminationTimetableType: true },
			where: { caseId: 1 }
		});
	});

	test('gets examination timetable item by id', async () => {
		databaseConnector.examinationTimetableItems.findUnique.mockResolvedValue(
			examinationTimetableItem
		);
		const resp = await request.get('/applications/examination-timetable-items/1');
		expect(resp.status).toEqual(200);
		expect(databaseConnector.examinationTimetableItems.findUnique).toHaveBeenCalledWith({
			where: { id: 1 }
		});
	});

	test('creates examination timetable item and examination sub folder', async () => {
		databaseConnector.case.findUnique.mockResolvedValue({ id: 1 });
		databaseConnector.folder.findFirst.mockResolvedValue({
			id: 1,
			caseId: 1,
			displayNameEn: 'Examination',
			parentFolderId: null,
			displayOrder: 100
		});
		databaseConnector.folder.create.mockResolvedValue({
			id: 2,
			caseId: 1,
			displayNameEn: 'Examination',
			parentFolderId: 1,
			displayOrder: 100
		});
		databaseConnector.examinationTimetableItems.create.mockResolvedValue(examinationTimetableItem);
		const resp = await request
			.post('/applications/examination-timetable-items')
			.send(examinationTimetableItem);
		expect(resp.status).toEqual(200);
		expect(databaseConnector.case.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
		expect(databaseConnector.examinationTimetableItems.create).toHaveBeenCalledTimes(1);
		expect(databaseConnector.folder.create).toHaveBeenCalledTimes(1);
	});

	test('creates examination timetable item and examination folder with sub folder', async () => {
		databaseConnector.case.findUnique.mockResolvedValue({ id: 1 });
		databaseConnector.folder.findFirst.mockResolvedValue(null);
		databaseConnector.folder.create.mockResolvedValue({
			id: 2,
			caseId: 1,
			displayNameEn: 'Examination',
			parentFolderId: 1,
			displayOrder: 100
		});
		databaseConnector.examinationTimetableItems.create.mockResolvedValue(examinationTimetableItem);
		const resp = await request
			.post('/applications/examination-timetable-items')
			.send(examinationTimetableItem);
		expect(resp.status).toEqual(200);
		expect(databaseConnector.case.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
		expect(databaseConnector.examinationTimetableItems.create).toHaveBeenCalledTimes(1);
		expect(databaseConnector.folder.create).toHaveBeenCalledTimes(2);
	});

	test('create examination timetable item returns 400 when invalid data is sent', async () => {
		const resp = await request.post('/applications/examination-timetable-items').send({});
		expect(resp.status).toEqual(400);
	});

	test('create examination timetable item returns 400 when invalid case is not exists', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(null);
		const resp = await request.post('/applications/examination-timetable-items').send({
			id: 1,
			caseId: 2,
			examinationTypeId: 1,
			name: 'Exmaination Timetable Item',
			description: 'Exmaination Timetable Item Description',
			date: '2023-02-27T10:00:00Z',
			startDate: '2023-02-27T10:00:00Z',
			startTime: '10:20',
			endDate: '2023-02-27T12:00:00Z',
			endTime: '12:20'
		});
		expect(resp.status).toEqual(400);
	});
});
