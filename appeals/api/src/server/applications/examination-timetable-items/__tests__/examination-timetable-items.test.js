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
	endDate: '2023-02-17T12:00:00Z',
	endTime: '12:20',
	published: true,
	ExaminationTimetableType: {
		id: 2,
		name: 'Compulsory Acquisition Hearing',
		templateType: 'starttime-mandatory',
		displayNameEn: 'Compulsory acquisition hearing',
		displayNameCy: 'Compulsory acquisition hearing'
	}
};

const examinationTimetableItemDeadline = {
	id: 1,
	caseId: 1,
	examinationTypeId: 3,
	name: 'Exmaination Timetable Item',
	description: '{"preText":"deadline category", "bulletPoints":["ponintone", "pointtwo"]}',
	date: '2023-02-27T10:00:00Z',
	startDate: '2023-02-27T10:00:00Z',
	startTime: '10:20',
	endDate: '2023-02-27T12:00:00Z',
	endTime: '12:20',
	published: false,
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
		databaseConnector.examinationTimetableItem.findMany.mockResolvedValue([
			examinationTimetableItem
		]);
		const resp = await request.get('/applications/examination-timetable-items/case/1');
		expect(resp.status).toEqual(200);
		expect(databaseConnector.examinationTimetableItem.findMany).toHaveBeenCalledWith({
			include: { ExaminationTimetableType: true },
			where: { caseId: 1 },
			orderBy: {
				date: 'asc'
			}
		});
	});

	test('gets examination timetable item by id', async () => {
		databaseConnector.examinationTimetableItem.findUnique.mockResolvedValue(
			examinationTimetableItem
		);
		const resp = await request.get('/applications/examination-timetable-items/1');
		expect(resp.status).toEqual(200);
		expect(databaseConnector.examinationTimetableItem.findUnique).toHaveBeenCalledWith({
			include: { ExaminationTimetableType: true },
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
		databaseConnector.examinationTimetableType.findUnique.mockResolvedValue({ name: 'NODeadline' });
		databaseConnector.examinationTimetableItem.create.mockResolvedValue(
			examinationTimetableItemDeadline
		);
		const resp = await request
			.post('/applications/examination-timetable-items')
			.send(examinationTimetableItemDeadline);
		expect(resp.status).toEqual(200);
		expect(databaseConnector.case.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
		expect(databaseConnector.examinationTimetableItem.create).toHaveBeenCalledTimes(1);
		expect(databaseConnector.folder.create).toHaveBeenCalledTimes(1);
		expect(databaseConnector.examinationTimetableType.findUnique).toHaveBeenCalledWith({
			where: { id: 3 }
		});
	});

	test('creates examination timetable throws an error when examination folder does not exist for the case', async () => {
		databaseConnector.case.findUnique.mockResolvedValue({ id: 1 });
		databaseConnector.folder.findFirst.mockResolvedValue(null);
		const resp = await request
			.post('/applications/examination-timetable-items')
			.send(examinationTimetableItem);
		expect(resp.status).toEqual(500);
		expect(databaseConnector.case.findUnique).toHaveBeenCalledTimes(1);
		expect(databaseConnector.folder.findFirst).toHaveBeenCalledTimes(1);
		expect(databaseConnector.examinationTimetableItem.create).toHaveBeenCalledTimes(0);
		expect(databaseConnector.folder.create).toHaveBeenCalledTimes(0);
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

	test('creates examination timetable item and examination deadline category sub folders', async () => {
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
		databaseConnector.examinationTimetableType.findUnique.mockResolvedValue({ name: 'Deadline' });
		databaseConnector.examinationTimetableItem.create.mockResolvedValue(
			examinationTimetableItemDeadline
		);
		const resp = await request
			.post('/applications/examination-timetable-items')
			.send(examinationTimetableItemDeadline);
		expect(resp.status).toEqual(200);
		expect(databaseConnector.case.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
		expect(databaseConnector.examinationTimetableItem.create).toHaveBeenCalledTimes(1);
		expect(databaseConnector.folder.create).toHaveBeenCalledTimes(4);
		expect(databaseConnector.examinationTimetableType.findUnique).toHaveBeenCalledWith({
			where: { id: 3 }
		});
	});

	test('publish examination timetable item returns 404 when invalid case is not exists', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(null);
		const resp = await request
			.patch('/applications/examination-timetable-items/publish/13324')
			.send({});
		expect(resp.status).toEqual(404);
	});

	test('publish examination timetable item publishes examination items for the case', async () => {
		databaseConnector.case.findUnique.mockResolvedValue({ id: 123 });
		const resp = await request
			.patch('/applications/examination-timetable-items/publish/123')
			.send({});
		expect(databaseConnector.examinationTimetableItem.updateMany).toHaveBeenCalledWith({
			where: {
				caseId: 123
			},
			data: { published: true }
		});

		expect(resp.status).toEqual(200);
	});

	test('Delete examination timetable item returns 404 when timetable is not exists', async () => {
		databaseConnector.examinationTimetableItem.findUnique.mockResolvedValue(null);
		const resp = await request.delete('/applications/examination-timetable-items/13324').send({});
		expect(resp.status).toEqual(404);
	});

	test('Delete examination timetable item returns 400 when timetable is published', async () => {
		databaseConnector.examinationTimetableItem.findUnique.mockResolvedValue(
			examinationTimetableItem
		);
		const resp = await request.delete('/applications/examination-timetable-items/13324').send({});
		expect(resp.status).toEqual(400);
	});

	test('Delete examination timetable item returns 200 when timetable is deleted successfully', async () => {
		databaseConnector.examinationTimetableItem.findUnique.mockResolvedValue(
			examinationTimetableItemDeadline
		);

		const resp = await request.delete('/applications/examination-timetable-items/123').send({});
		expect(databaseConnector.examinationTimetableItem.delete).toHaveBeenCalledWith({
			where: {
				id: 123
			}
		});

		expect(resp.status).toEqual(200);
	});
});
