const { databaseConnector } = await import('#utils/database-connector.js');
import { request } from '#app-test';

const allMeetings = [
	{
		id: 1,
		caseId: 100000000,
		agenda: 'This is a test agenda',
		pinsRole: 'Observer',
		meetingDate: '2024-01-15T10:00:00Z',
		meetingType: 'Pre-application',
		createdAt: '2024-01-01T09:00:00Z'
	},
	{
		id: 2,
		caseId: 100000000,
		agenda: 'This is another test agenda',
		pinsRole: 'Facilitator',
		meetingDate: '2024-02-20T14:00:00Z',
		meetingType: 'Examination',
		createdAt: '2024-01-05T11:30:00Z'
	}
];

const meetingPayload = {
	agenda: 'This is a payload agenda',
	pinsRole: 'Advisor',
	meetingDate: '2024-03-10T09:30:00Z',
	meetingType: 'Pre-application'
};

const malformedMeetingPayload = {
	agenda: 'This is a valid agenda',
	pinsRole: 'Invalid role'
};

describe('Test Meetings API Endpoints', () => {
	afterEach(() => {
		databaseConnector.meeting.findMany?.mockReset?.();
		databaseConnector.meeting.findFirst?.mockReset?.();
		databaseConnector.meeting.create?.mockReset?.();
		databaseConnector.meeting.upsert?.mockReset?.();
		databaseConnector.meeting.delete.mockReset?.();
	});

	describe('GET /applications/:id/meetings', () => {
		it('should retrieve all meetings for a specific application', async () => {
			databaseConnector.meeting.findMany.mockResolvedValue(allMeetings);

			const res = await request.get(`/applications/100000000/meetings`);

			expect(res.status).toBe(200);
			expect(databaseConnector.meeting.findMany).toHaveBeenCalledWith({
				where: { caseId: 100000000 },
				orderBy: { createdAt: 'asc' }
			});
			expect(res.body).toEqual(allMeetings);
		});

		it('should return 404 if no meetings found for the application', async () => {
			databaseConnector.meeting.findMany.mockResolvedValue([]);

			const res = await request.get(`/applications/100000000/meetings`);

			expect(res.status).toBe(404);
			expect(res.body).toEqual({
				errors: 'No meetings found for application with id: 100000000'
			});
		});
	});

	describe('POST /applications/:id/meetings', () => {
		it('should create a new meeting for an application', async () => {
			const createdMeeting = {
				id: 1,
				caseId: 100000000,
				...meetingPayload,
				createdAt: '2025-01-01T01:00:00.000Z'
			};
			databaseConnector.meeting.create.mockResolvedValueOnce(createdMeeting);

			const res = await request.post(`/applications/100000000/meetings`).send(meetingPayload);

			expect(res.status).toBe(201);
			expect(databaseConnector.meeting.create).toHaveBeenCalledWith({
				data: { caseId: 100000000, ...meetingPayload }
			});
			expect(res.body).toEqual(createdMeeting);
		});

		it('should return 400 for malformed meeting payload', async () => {
			const res = await request
				.post(`/applications/100000000/meetings`)
				.send(malformedMeetingPayload);

			expect(res.status).toBe(400);
			expect(res.body).toEqual({
				errors: expect.any(Object)
			});
		});
	});

	describe('GET /applications/:id/meetings/:meetingId', () => {
		it('should retrieve a specific meeting for an application', async () => {
			const meeting = allMeetings[0];
			databaseConnector.meeting.findFirst.mockResolvedValue(meeting);

			const res = await request.get(`/applications/100000000/meetings/1`);

			expect(res.status).toBe(200);
			expect(databaseConnector.meeting.findFirst).toHaveBeenCalledWith({
				where: { caseId: 100000000, id: 1 }
			});
			expect(res.body).toEqual(meeting);
		});

		it('should return 404 if the specific meeting is not found', async () => {
			databaseConnector.meeting.findFirst.mockResolvedValue(null);

			const res = await request.get(`/applications/100000000/meetings/999`);

			expect(res.status).toBe(404);
			expect(res.body).toEqual({
				errors: 'Meeting with id: 999 not found'
			});
		});
	});

	describe('PATCH /applications/:id/meetings/:meetingId', () => {
		const updatePayload = {
			agenda: 'This is an updated test agenda'
		};

		it('should update a specific meeting for an application', async () => {
			databaseConnector.meeting.findFirst
				.mockResolvedValueOnce(allMeetings[0])
				.mockResolvedValueOnce({ ...allMeetings[0], agenda: updatePayload.agenda });
			databaseConnector.meeting.upsert.mockResolvedValueOnce({
				...allMeetings[0],
				agenda: updatePayload.agenda
			});

			const res = await request.patch(`/applications/100000000/meetings/1`).send(updatePayload);

			expect(res.status).toBe(200);
			expect(databaseConnector.meeting.upsert).toHaveBeenCalledWith({
				where: { id: 1 },
				create: { caseId: 100000000, agenda: updatePayload.agenda },
				update: { agenda: updatePayload.agenda }
			});
			expect(res.body).toEqual({ ...allMeetings[0], agenda: updatePayload.agenda });
		});

		it('should return 400 if the meeting could not be updated', async () => {
			databaseConnector.meeting.upsert.mockResolvedValueOnce(null);

			const res = await request.patch(`/applications/100000000/meetings/1`).send(updatePayload);

			expect(res.status).toBe(400);
			expect(res.body).toEqual({
				errors: 'Meeting could not be updated for application with id: 100000000'
			});
		});
	});

	describe('DELETE /applications/:id/meetings/:meetingId', () => {
		it('should delete a specific meeting for an application', async () => {
			databaseConnector.meeting.findFirst.mockResolvedValueOnce(allMeetings[0]);
			databaseConnector.meeting.delete.mockResolvedValueOnce(allMeetings[0]);

			const res = await request.delete(`/applications/100000000/meetings/1`);

			expect(res.status).toBe(204);
			expect(databaseConnector.meeting.delete).toHaveBeenCalledWith({
				where: { id: 1 }
			});
		});

		it('should return 404 if the meeting to delete is not found', async () => {
			databaseConnector.meeting.findFirst.mockResolvedValueOnce(null);

			const res = await request.delete(`/applications/100000000/meetings/999`);

			expect(res.status).toBe(404);
			expect(res.body).toEqual({
				errors: 'Meeting with id: 999 not found'
			});
		});
	});
});
