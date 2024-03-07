import { jest } from '@jest/globals';
import { request } from '../../../app-test.js';
import { eventClient } from '#infrastructure/event-client.js';
import { NSIP_EXAM_TIMETABLE, FOLDER } from '#infrastructure/topics.js';
import { EventType } from '@pins/event-client';

const { databaseConnector } = await import('../../../utils/database-connector.js');

const project = {
	id: 1,
	reference: 'REF-ID-1',
	modifiedAt: '2024-01-16T16:44:24.930Z',
	createdAt: '2024-01-16T16:44:26.710Z',
	description: 'case description',
	title: 'Office Use Test Application 1',
	hasUnpublishedChanges: false,
	applicantId: 1
};

const examinationTimetableItem = {
	id: 1,
	examinationTypeId: 1,
	name: 'Examination Timetable Item',
	description: '{"preText":"pretext", "bulletPoints":["pointone", "pointtwo"]}',
	date: '2023-02-27T10:00:00Z',
	folderId: 1234,
	startDate: '2023-02-27T10:00:00Z',
	startTime: '10:20',
	endTime: '12:20',
	ExaminationTimetableType: {
		id: 2,
		name: 'Compulsory Acquisition Hearing',
		templateType: 'compulsory-acquisition-hearing',
		displayNameEn: 'Compulsory acquisition hearing',
		displayNameCy: 'Compulsory acquisition hearing'
	},
	ExaminationTimetable: {
		caseId: 1,
		published: true
	}
};

const examinationTimetableData = {
	id: 1,
	caseId: 1,
	published: true,
	case: project
};

const examinationTimetableItemDeadline = {
	id: 1,
	caseId: 1,
	examinationTypeId: 3,
	name: 'Examination Timetable Item',
	description: '{"preText":"deadline category", "bulletPoints":["pointone", "pointtwo"]}',
	date: '2023-02-27T10:00:00Z',
	startDate: '2023-02-27T10:00:00Z',
	startTime: '10:20',
	endTime: '12:20',
	folderId: 1234,
	ExaminationTimetableType: {
		id: 3,
		name: 'Deadline',
		templateType: 'deadline',
		displayNameEn: 'Deadline',
		displayNameCy: 'Deadline'
	},
	ExaminationTimetable: {
		caseId: 1,
		published: false
	}
};

const examinationTimetableItemDeadlineUpdateBody = {
	caseId: 1,
	examinationTypeId: 3,
	name: 'Examination Timetable Item updated',
	description:
		'{"preText":"deadline category updated", "bulletPoints":["pointone updated", "pointtwo updated"]}',
	date: '2023-03-28T10:00:000Z',
	startDate: '2023-03-27T10:00:000Z',
	startTime: '11:20',
	endTime: '13:20',
	published: false,
	id: 1
};
const examinationTimetableItemDeadlineUpdateResponse = {
	id: 1,
	caseId: 1,
	examinationTimetableId: 1,
	examinationTypeId: 3,
	name: 'Examination Timetable Item updated',
	description:
		'{"preText":"deadline category updated", "bulletPoints":["pointone updated", "pointtwo updated"]}',
	date: '2023-03-28T10:00:00Z',
	startDate: '2023-03-27T10:00:00Z',
	startTime: '11:20',
	endTime: '13:20',
	published: false,
	ExaminationTimetableType: {
		id: 3,
		name: 'Deadline',
		templateType: 'deadline',
		displayNameEn: 'Deadline',
		displayNameCy: 'Deadline'
	}
};

const examinationFolder = {
	id: 1,
	caseId: 1,
	displayNameEn: 'Examination',
	stage: 'Examination',
	parentFolderId: null,
	displayOrder: 100
};

const examinationSubFolders = [
	{
		id: 2,
		caseId: 1,
		displayNameEn: 'pointone',
		stage: 'Examination',
		parentFolderId: 1,
		displayOrder: 100
	},
	{
		id: 3,
		caseId: 1,
		displayNameEn: 'pointtwo',
		stage: 'Examination',
		parentFolderId: 1,
		displayOrder: 200
	},
	{
		id: 4,
		caseId: 1,
		displayNameEn: 'Other',
		displayNameCy: 'Arall',
		stage: 'Examination',
		parentFolderId: 1,
		displayOrder: 300
	}
];

const publishExaminationTimetableItemsData = [
	{
		id: 1,
		examinationTimetableId: 1,
		examinationTypeId: 1,
		name: 'My timetable',
		description:
			'{"preText":"Some description","bulletPoints":["Line item 1","Line item 2","Line item 3"]}',
		date: new Date('2022-01-01T00:00:00.000Z'),
		startDate: null,
		startTime: '13:00',
		endTime: '13:59',
		folderId: 5167,
		ExaminationTimetableType: {
			id: 1,
			name: 'Accompanied Site Inspection',
			templateType: 'accompanied-site-inspection',
			displayNameEn: 'Accompanied site inspection',
			displayNameCy: 'Accompanied site inspection'
		}
	},
	{
		id: 2,
		examinationTimetableId: 1,
		examinationTypeId: 3,
		name: 'Test deadline',
		description: '{"preText":"Description","bulletPoints":["Line item 1","Line item 2"]}',
		date: new Date('2023-06-20T00:00:00.000Z'),
		startDate: new Date('2022-12-12T00:00:00.000Z'),
		startTime: '13:00',
		endTime: '13:00',
		folderId: 5168,
		ExaminationTimetableType: {
			id: 3,
			name: 'Deadline',
			templateType: 'deadline',
			displayNameEn: 'Deadline',
			displayNameCy: 'Deadline'
		}
	},
	{
		id: 3,
		examinationTimetableId: 1,
		examinationTypeId: 3,
		name: 'Deadline For Close Of Examination',
		description:
			'{"preText":"Description","bulletPoints":["Line item 1","Line item 2", "Line item 3","Line item 4"]}',
		date: new Date('2023-06-20T00:00:00.000Z'),
		startDate: new Date('2022-12-12T00:00:00.000Z'),
		startTime: '13:00',
		endTime: '13:00',
		folderId: 5168,
		ExaminationTimetableType: {
			id: 4,
			name: 'Deadline For Close Of Examination',
			templateType: 'deadline-for-close-of-examination',
			displayNameEn: 'Deadline for close of examination',
			displayNameCy: 'Deadline for close of examination'
		}
	},
	{
		id: 4,
		examinationTimetableId: 1,
		examinationTypeId: 3,
		name: 'Preliminary Meeting',
		description:
			'{"preText":"Description","bulletPoints":["Line item 1","Line item 2", "Line item 3","Line item 4"]}',
		date: new Date('2023-06-20T00:00:00.000Z'),
		startDate: new Date('2022-12-12T00:00:00.000Z'),
		startTime: '13:00',
		endTime: '13:00',
		folderId: 5168,
		ExaminationTimetableType: {
			id: 9,
			name: 'Preliminary Meeting',
			templateType: 'preliminary-meeting',
			displayNameEn: 'Preliminary meeting',
			displayNameCy: 'Preliminary meeting'
		}
	}
];

const expectedPublishExaminationTimetablePayload = {
	caseReference: 'REF-ID-1',
	events: [
		{
			date: '2022-01-01T00:00:00.000',
			description: 'Some description\r\n* Line item 1\r\n* Line item 2\r\n* Line item 3',
			eventDeadlineStartDate: undefined,
			eventId: 1,
			eventLineItems: [],
			eventTitle: 'My timetable',
			type: 'Accompanied Site Inspection'
		},
		{
			date: '2023-06-20T00:00:00.000',
			description: 'Description',
			eventDeadlineStartDate: '2022-12-12T00:00:00.000',
			eventId: 2,
			eventLineItems: [{ description: 'Line item 1' }, { description: 'Line item 2' }],
			eventTitle: 'Test deadline',
			type: 'Deadline'
		},
		{
			date: '2023-06-20T00:00:00.000',
			description:
				'Description\r\n* Line item 1\r\n* Line item 2\r\n* Line item 3\r\n* Line item 4',
			eventDeadlineStartDate: '2022-12-12T00:00:00.000',
			eventId: 3,
			eventLineItems: [],
			eventTitle: 'Deadline For Close Of Examination',
			type: 'Deadline For Close Of Examination'
		},
		{
			date: '2023-06-20T00:00:00.000',
			description:
				'Description\r\n* Line item 1\r\n* Line item 2\r\n* Line item 3\r\n* Line item 4',
			eventDeadlineStartDate: '2022-12-12T00:00:00.000',
			eventId: 4,
			eventLineItems: [],
			eventTitle: 'Preliminary Meeting',
			type: 'Preliminary Meeting'
		}
	]
};

const buildExpectedFolder = (folder) => {
	return {
		id: folder.id,
		caseReference: project.reference,
		displayNameEnglish: folder.displayNameEn,
		displayNameWelsh: folder.displayNameCy || folder.displayNameEn,
		parentFolderId: folder.parentFolderId
	};
};

const expectedFolder = buildExpectedFolder(examinationFolder);
const expectedSubFolders = examinationSubFolders.map(buildExpectedFolder);

describe('Test examination timetable items API', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	test('gets all examination timetable items for case', async () => {
		databaseConnector.folder.findUnique.mockResolvedValue(examinationFolder);
		databaseConnector.document.count.mockResolvedValue(0);
		databaseConnector.folder.findMany.mockResolvedValue([]);
		databaseConnector.examinationTimetableItem.findMany.mockResolvedValue([
			examinationTimetableItem
		]);
		databaseConnector.examinationTimetable.findUnique.mockResolvedValue(examinationTimetableData);
		const resp = await request.get('/applications/examination-timetable-items/case/1');
		expect(resp.status).toEqual(200);
		expect(resp.body.items[0].submissions).toBe(false);
		expect(resp.body.items[0].description).toBe(
			`{"preText":"pretext\\r\\n","bulletPoints":[" pointone\\r\\n"," pointtwo"]}`
		);
		expect(databaseConnector.examinationTimetable.findUnique).toHaveBeenCalledWith({
			where: { caseId: 1 }
		});
		expect(databaseConnector.examinationTimetableItem.findMany).toHaveBeenCalledWith({
			include: { ExaminationTimetableType: true },
			where: { examinationTimetableId: 1 },
			orderBy: {
				date: 'asc'
			}
		});
	});

	test('gets examination timetable item by id', async () => {
		databaseConnector.folder.findUnique.mockResolvedValue(examinationFolder);
		databaseConnector.document.count.mockResolvedValue(1);
		databaseConnector.folder.findMany.mockResolvedValue([]);
		databaseConnector.examinationTimetableItem.findUnique.mockResolvedValue(
			examinationTimetableItem
		);
		const resp = await request.get('/applications/examination-timetable-items/1');
		expect(resp.status).toEqual(200);
		expect(resp.body.submissions).toBe(true);
		expect(resp.body.description).toBe(
			`{"preText":"pretext\\r\\n","bulletPoints":[" pointone\\r\\n"," pointtwo"]}`
		);
		expect(databaseConnector.examinationTimetableItem.findUnique).toHaveBeenCalledWith({
			include: { ExaminationTimetable: true, ExaminationTimetableType: true },
			where: { id: 1 }
		});
	});

	test('creates examination timetable item and examination sub folder', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(project);
		databaseConnector.folder.findFirst.mockResolvedValue(examinationFolder);
		databaseConnector.folder.create.mockResolvedValue(examinationSubFolders[0]);
		databaseConnector.examinationTimetableType.findUnique.mockResolvedValue({ name: 'NODeadline' });
		databaseConnector.examinationTimetableItem.create.mockResolvedValue(
			examinationTimetableItemDeadline
		);
		databaseConnector.examinationTimetable.findUnique.mockResolvedValue(null);
		databaseConnector.examinationTimetable.create.mockResolvedValue(examinationTimetableData);
		const resp = await request
			.post('/applications/examination-timetable-items')
			.send(examinationTimetableItemDeadline);
		expect(resp.status).toEqual(200);
		expect(databaseConnector.examinationTimetableItem.create).toHaveBeenCalledTimes(1);
		expect(databaseConnector.folder.create).toHaveBeenCalledTimes(1);
		expect(databaseConnector.folder.create).toHaveBeenCalledWith({
			data: {
				caseId: 1,
				displayNameEn: '27 Feb 2023 - Examination Timetable Item',
				stage: 'Examination',
				parentFolderId: 1,
				displayOrder: 20230227
			}
		});
		expect(databaseConnector.examinationTimetable.create).toHaveBeenCalledTimes(1);
		expect(databaseConnector.examinationTimetable.findUnique).toHaveBeenCalledTimes(1);
		expect(databaseConnector.examinationTimetableType.findUnique).toHaveBeenCalledWith({
			where: { id: 3 }
		});
	});

	test('creates examination timetable item and pre-examination sub folder', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(project);
		databaseConnector.folder.findFirst.mockResolvedValue(examinationFolder);
		databaseConnector.folder.create.mockResolvedValue(examinationSubFolders[0]);
		databaseConnector.examinationTimetableType.findUnique.mockResolvedValue({
			name: 'NODeadline',
			templateType: 'procedural-deadline'
		});
		databaseConnector.examinationTimetableItem.create.mockResolvedValue(
			examinationTimetableItemDeadline
		);
		databaseConnector.examinationTimetable.findUnique.mockResolvedValue(null);
		databaseConnector.examinationTimetable.create.mockResolvedValue(examinationTimetableData);
		const resp = await request
			.post('/applications/examination-timetable-items')
			.send(examinationTimetableItemDeadline);
		expect(resp.status).toEqual(200);
		expect(databaseConnector.examinationTimetableItem.create).toHaveBeenCalledTimes(1);
		expect(databaseConnector.folder.create).toHaveBeenCalledTimes(1);
		expect(databaseConnector.folder.create).toHaveBeenCalledWith({
			data: {
				caseId: 1,
				displayNameEn: '27 Feb 2023 - Examination Timetable Item',
				stage: 'Pre-examination',
				parentFolderId: 1,
				displayOrder: 20230227
			}
		});
		expect(databaseConnector.examinationTimetable.create).toHaveBeenCalledTimes(1);
		expect(databaseConnector.examinationTimetable.findUnique).toHaveBeenCalledTimes(1);
		expect(databaseConnector.examinationTimetableType.findUnique).toHaveBeenCalledWith({
			where: { id: 3 }
		});
	});

	test('creates examination timetable throws an error when examination folder does not exist for the case', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(project);
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
			name: 'Examination Timetable Item',
			description: 'Examination Timetable Item Description',
			date: '2023-02-27T10:00:00Z',
			startDate: '2023-02-27T10:00:00Z',
			startTime: '10:20',
			endTime: '12:20'
		});
		expect(resp.status).toEqual(400);
	});

	test('creates examination timetable item and examination deadline category sub folders', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(project);
		databaseConnector.examinationTimetable.findUnique.mockResolvedValue(null);
		databaseConnector.examinationTimetable.create.mockResolvedValue(examinationTimetableData);
		databaseConnector.folder.findFirst.mockResolvedValue(examinationFolder);
		databaseConnector.folder.create
			.mockResolvedValueOnce(examinationFolder)
			.mockResolvedValueOnce(examinationSubFolders[0])
			.mockResolvedValueOnce(examinationSubFolders[1])
			.mockResolvedValueOnce(examinationSubFolders[2]);
		databaseConnector.examinationTimetableType.findUnique.mockResolvedValue({ name: 'Deadline' });
		databaseConnector.examinationTimetableItem.create.mockResolvedValue(
			examinationTimetableItemDeadline
		);
		const resp = await request
			.post('/applications/examination-timetable-items')
			.send(examinationTimetableItemDeadline);
		expect(resp.status).toEqual(200);
		expect(databaseConnector.examinationTimetableItem.create).toHaveBeenCalledTimes(1);
		expect(databaseConnector.examinationTimetable.create).toHaveBeenCalledTimes(1);
		expect(databaseConnector.examinationTimetable.findUnique).toHaveBeenCalledTimes(1);

		expect(databaseConnector.folder.create).toHaveBeenCalledTimes(4);

		expect(databaseConnector.folder.create).toHaveBeenNthCalledWith(1, {
			data: {
				caseId: 1,
				displayOrder: 20230227,
				displayNameEn: '27 Feb 2023 - Examination Timetable Item',
				parentFolderId: 1,
				stage: 'Examination'
			}
		});

		const expectedCreatedSubFolder = {
			caseId: 1,
			displayOrder: 100,
			parentFolderId: 1,
			stage: 'Examination'
		};

		expect(databaseConnector.folder.create).toHaveBeenNthCalledWith(2, {
			data: { ...expectedCreatedSubFolder, displayNameEn: 'Other', displayNameCy: 'Arall' }
		});

		expect(databaseConnector.folder.create).toHaveBeenNthCalledWith(3, {
			data: { ...expectedCreatedSubFolder, displayNameEn: 'pointone' }
		});

		expect(databaseConnector.folder.create).toHaveBeenNthCalledWith(4, {
			data: { ...expectedCreatedSubFolder, displayNameEn: 'pointtwo' }
		});
		expect(databaseConnector.examinationTimetableType.findUnique).toHaveBeenCalledWith({
			where: { id: 3 }
		});

		expect(eventClient.sendEvents).toHaveBeenCalledTimes(2);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			1,
			FOLDER,
			[expectedFolder],
			EventType.Create
		);

		expect(eventClient.sendEvents).toHaveBeenLastCalledWith(
			FOLDER,
			expectedSubFolders,
			EventType.Create
		);
	});

	test('publish examination timetable item returns 404 when invalid case is not exists', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(null);
		const resp = await request
			.patch('/applications/examination-timetable-items/publish/13324')
			.send({});
		expect(resp.status).toEqual(404);
	});

	test('publish examination timetable item publishes examination items for the case', async () => {
		databaseConnector.case.findUnique.mockResolvedValueOnce({});

		databaseConnector.examinationTimetable.findUnique.mockResolvedValue({
			id: 1,
			ExaminationTimetableItem: publishExaminationTimetableItemsData,
			case: { id: 123, reference: 'REF-ID-1' }
		});

		databaseConnector.examinationTimetable.update.mockResolvedValueOnce({ id: 123 });

		const resp = await request
			.patch('/applications/examination-timetable-items/publish/123')
			.send({});

		expect(databaseConnector.examinationTimetable.update).toHaveBeenCalledWith({
			where: {
				id: 1
			},
			data: { published: true, publishedAt: expect.any(Date), updatedAt: expect.any(Date) }
		});

		expect(eventClient.sendEvents).toHaveBeenCalledTimes(1);

		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			NSIP_EXAM_TIMETABLE,
			[expectedPublishExaminationTimetablePayload],
			EventType.Publish
		);

		expect(resp.status).toEqual(200);
	});

	test('unpublish examination timetable item returns 404 when invalid case is not exists', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(null);
		const resp = await request
			.patch('/applications/examination-timetable-items/unpublish/13324')
			.send({});
		expect(resp.status).toEqual(404);
	});

	test('unpublish examination timetable item unpublishes examination items for the case', async () => {
		databaseConnector.case.findUnique.mockResolvedValueOnce({});

		databaseConnector.examinationTimetable.update.mockResolvedValueOnce({ id: 123 });
		databaseConnector.examinationTimetable.findUnique.mockResolvedValue({
			id: 1,
			ExaminationTimetableItem: publishExaminationTimetableItemsData,
			case: { id: 1, reference: 'REF-ID-1' }
		});
		databaseConnector.examinationTimetableItem.findMany.mockResolvedValueOnce(
			publishExaminationTimetableItemsData
		);
		const resp = await request
			.patch('/applications/examination-timetable-items/unpublish/123')
			.send({});
		expect(databaseConnector.examinationTimetable.update).toHaveBeenCalledWith({
			where: {
				id: 1
			},
			data: { published: false }
		});

		expect(eventClient.sendEvents).toHaveBeenCalledTimes(1);

		expect(eventClient.sendEvents).toHaveBeenCalledWith(
			NSIP_EXAM_TIMETABLE,
			[expectedPublishExaminationTimetablePayload],
			EventType.Unpublish
		);

		expect(resp.status).toEqual(200);
	});

	test('Delete examination timetable item returns 404 when timetable is not exists', async () => {
		databaseConnector.examinationTimetableItem.findUnique.mockResolvedValue(null);
		const resp = await request.delete('/applications/examination-timetable-items/13324').send({});
		expect(resp.status).toEqual(404);
	});

	test('Delete examination timetable item returns 400 when timetable is published and has submittions', async () => {
		databaseConnector.folder.findUnique.mockResolvedValue(examinationFolder);
		databaseConnector.document.count.mockResolvedValue(1);
		databaseConnector.examinationTimetableItem.findUnique.mockResolvedValue(
			examinationTimetableItem
		);
		const resp = await request.delete('/applications/examination-timetable-items/13324').send({});
		expect(resp.status).toEqual(400);
	});

	test('Delete examination timetable item returns 200 when timetable is deleted successfully', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(project);
		databaseConnector.folder.findUnique.mockResolvedValue(examinationFolder);
		databaseConnector.document.count.mockResolvedValue(0);
		databaseConnector.folder.findMany.mockResolvedValue(examinationSubFolders);
		databaseConnector.examinationTimetableItem.findUnique.mockResolvedValue(
			examinationTimetableItemDeadline
		);

		const resp = await request.delete('/applications/examination-timetable-items/123').send({});
		expect(databaseConnector.examinationTimetableItem.delete).toHaveBeenCalledWith({
			where: {
				id: 123
			}
		});
		expect(databaseConnector.folder.delete).toHaveBeenCalledTimes(1);
		expect(databaseConnector.folder.deleteMany).toHaveBeenCalledTimes(1);

		expect(eventClient.sendEvents).toHaveBeenCalledTimes(2);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			1,
			FOLDER,
			expectedSubFolders,
			EventType.Delete
		);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			2,
			FOLDER,
			[expectedFolder],
			EventType.Delete
		);

		expect(resp.status).toEqual(200);
	});

	test('update examination timetable item successfully', async () => {
		const expectedFullTimetable = {
			...examinationTimetableData,
			ExaminationTimetableItem: [
				{
					...examinationTimetableItemDeadlineUpdateResponse,
					date: new Date('2023-03-28T10:00:00Z'),
					startDate: new Date('2023-03-27T10:00:00Z')
				}
			]
		};

		databaseConnector.case.findUnique.mockResolvedValue(project);
		databaseConnector.folder.findUnique.mockResolvedValue(examinationFolder);
		databaseConnector.folder.findMany.mockResolvedValue(examinationSubFolders);
		databaseConnector.folder.deleteMany.mockResolvedValue(examinationSubFolders);
		databaseConnector.folder.update.mockResolvedValue(examinationFolder);
		databaseConnector.folder.create
			.mockResolvedValueOnce(examinationSubFolders[0])
			.mockResolvedValueOnce(examinationSubFolders[1])
			.mockResolvedValueOnce(examinationSubFolders[2]);
		databaseConnector.examinationTimetableItem.findUnique.mockResolvedValue(
			examinationTimetableItemDeadline
		);
		databaseConnector.examinationTimetableItem.update.mockResolvedValue(
			examinationTimetableItemDeadlineUpdateResponse
		);
		databaseConnector.examinationTimetableItem.findMany.mockResolvedValueOnce(null);
		databaseConnector.examinationTimetable.findUnique.mockResolvedValue(expectedFullTimetable);
		databaseConnector.examinationTimetableType.findUnique.mockResolvedValue({
			name: 'Deadline'
		});

		const resp = await request
			.patch('/applications/examination-timetable-items/1')
			.send(examinationTimetableItemDeadlineUpdateBody);

		expect(resp.status).toEqual(200);
		expect(resp.body).toEqual(examinationTimetableItemDeadlineUpdateResponse);
		expect(databaseConnector.folder.deleteMany).toHaveBeenCalledTimes(1);
		expect(databaseConnector.folder.findUnique).toHaveBeenCalledTimes(1);
		expect(databaseConnector.folder.update).toHaveBeenCalledTimes(1);

		expect(databaseConnector.folder.create).toHaveBeenCalledTimes(3);

		const expectedCreatedSubFolder = {
			caseId: 1,
			displayOrder: 100,
			parentFolderId: 1234,
			stage: 'Examination'
		};

		expect(databaseConnector.folder.create).toHaveBeenNthCalledWith(1, {
			data: { ...expectedCreatedSubFolder, displayNameEn: 'Other', displayNameCy: 'Arall' }
		});

		expect(databaseConnector.folder.create).toHaveBeenNthCalledWith(2, {
			data: { ...expectedCreatedSubFolder, displayNameEn: 'pointone updated' }
		});

		expect(databaseConnector.folder.create).toHaveBeenNthCalledWith(3, {
			data: { ...expectedCreatedSubFolder, displayNameEn: 'pointtwo updated' }
		});

		expect(databaseConnector.examinationTimetableItem.update).toHaveBeenCalledTimes(1);

		const expectedUpdateExaminationTimetablePayload = {
			caseReference: 'REF-ID-1',
			events: [
				{
					type: 'Deadline',
					date: '2023-03-28T10:00:00.000',
					description: 'deadline category updated',
					eventTitle: 'Examination Timetable Item updated',
					eventDeadlineStartDate: '2023-03-27T10:00:00.000',
					eventId: 1,
					eventLineItems: [{ description: 'pointone updated' }, { description: 'pointtwo updated' }]
				}
			]
		};

		expect(eventClient.sendEvents).toHaveBeenCalledTimes(4);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			1,
			FOLDER,
			[expectedFolder],
			EventType.Update
		);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			2,
			FOLDER,
			expectedSubFolders,
			EventType.Delete
		);

		expect(eventClient.sendEvents).toHaveBeenNthCalledWith(
			3,
			FOLDER,
			expectedSubFolders,
			EventType.Create
		);

		expect(eventClient.sendEvents).toHaveBeenLastCalledWith(
			NSIP_EXAM_TIMETABLE,
			[expectedUpdateExaminationTimetablePayload],
			EventType.Update
		);
	});

	test('update examination timetable item throws 400 error on invalid exam type', async () => {
		databaseConnector.examinationTimetableType.findUnique.mockResolvedValue(null);
		databaseConnector.examinationTimetableItem.update.mockResolvedValue({});
		const resp = await request
			.patch('/applications/examination-timetable-items/1')
			.send({ examinationTypeId: 9999 });
		expect(resp.status).toEqual(400);
		expect(resp.body).toEqual({ errors: { examinationTypeId: 'Must be valid examination type' } });
		expect(databaseConnector.examinationTimetableItem.update).toHaveBeenCalledTimes(0);
	});

	test('update examination timetable item throws 400 error on invalid case id', async () => {
		databaseConnector.case.findUnique.mockResolvedValue(null);
		databaseConnector.examinationTimetableItem.update.mockResolvedValue({});
		const resp = await request
			.patch('/applications/examination-timetable-items/1')
			.send({ caseId: 9999 });
		expect(resp.status).toEqual(400);
		expect(databaseConnector.examinationTimetableItem.update).toHaveBeenCalledTimes(0);
	});

	test('update examination timetable item throws 400 error on invalid non-numeric examination item id', async () => {
		databaseConnector.examinationTimetableItem.findUnique.mockResolvedValue(null);
		databaseConnector.examinationTimetableItem.update.mockResolvedValue({});
		const resp = await request
			.patch('/applications/examination-timetable-items/wrongid')
			.send({ name: 'new name' });
		expect(resp.status).toEqual(400);
		expect(databaseConnector.examinationTimetableItem.update).toHaveBeenCalledTimes(0);
	});

	test('update examination timetable item throws 400 error on invalid examination item id', async () => {
		databaseConnector.examinationTimetableItem.findUnique.mockResolvedValue(null);
		databaseConnector.examinationTimetableItem.update.mockResolvedValue({});
		const resp = await request
			.patch('/applications/examination-timetable-items/9999')
			.send({ name: 'new name' });
		expect(resp.status).toEqual(400);
		expect(databaseConnector.examinationTimetableItem.update).toHaveBeenCalledTimes(0);
	});
});
