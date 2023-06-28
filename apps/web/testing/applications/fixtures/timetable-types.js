export const fixtureTimetableTypes = [
	{
		name: 'starttime-mandatory',
		templateType: 'starttime-mandatory',
		displayNameEn: 'starttime-mandatory'
	},
	{
		name: 'deadline',
		templateType: 'deadline',
		displayNameEn: 'deadline'
	},
	{
		name: 'no-times',
		templateType: 'no-times',
		displayNameEn: 'no-times'
	},
	{
		name: 'deadline-startdate-mandatory',
		templateType: 'deadline-startdate-mandatory',
		displayNameEn: 'deadline-startdate-mandatory'
	},
	{
		name: 'starttime-optional',
		templateType: 'starttime-optional',
		displayNameEn: 'starttime-optional'
	}
];

export const fixtureTimetableItems = [
	{
		id: 1,
		examinationTypeId: 2,
		name: 'Test',
		description: '{"preText":"test","bulletPoints":["ponintone", "pointtwo"]}',
		date: '2023-10-10T00:00:00.000Z',
		startDate: null,
		startTime: '10:10',
		endDate: null,
		endTime: '10:10',
		examinationTimetableId: 1,
		ExaminationTimetableType: {
			id: 2,
			name: 'Deadline',
			templateType: 'deadline'
		}
	},
	{
		id: 2,
		examinationTypeId: 3,
		name: 'Test',
		description: '{"preText":"test","bulletPoints":["ponintone", "pointtwo"]}',
		date: '2023-10-10T00:00:00.000Z',
		startDate: null,
		startTime: '10:10',
		endDate: null,
		endTime: '10:10',
		examinationTimetableId: 2,
		ExaminationTimetableType: {
			id: 3,
			name: 'Procedural Deadline (Pre-Examination)',
			templateType: 'deadline-startdate-mandatory'
		}
	}
];

export const fixtureTimetable = {
	id: 1,
	caseId: 1,
	published: true,
	publishedAt: '2023-10-10T00:00:00.000Z',
	updatedAt: '2023-10-11T00:00:00.000Z',
	createdAt: '2023-10-11T00:00:00.000Z',
	items: fixtureTimetableItems
};
