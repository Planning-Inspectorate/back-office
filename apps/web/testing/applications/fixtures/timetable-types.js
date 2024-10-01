export const fixtureTimetableTypes = [
	'accompanied-site-inspection',
	'compulsory-acquisition-hearing',
	'deadline',
	'deadline-for-close-of-examination',
	'issued-by',
	'issue-specific-hearing',
	'open-floor-hearing',
	'other-meeting',
	'preliminary-meeting',
	'procedural-deadline',
	'procedural-decision',
	'publication-of'
].map((name) => ({
	name,
	templateType: name,
	displayNameEn: name
}));

export const fixtureTimetableItems = [
	{
		id: 1,
		examinationTypeId: 2,
		name: 'Test',
		description: '{"preText":"test","bulletPoints":["ponintone", "pointtwo"]}',
		date: '2023-10-10T09:10:00.000Z',
		startDate: '2023-10-10T09:10:00.000Z',
		endDate: null,
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
		date: '2023-10-10T09:10:00.000Z',
		startDate: '2023-10-10T09:10:00.000Z',
		endDate: null,
		examinationTimetableId: 2,
		ExaminationTimetableType: {
			id: 3,
			name: 'Procedural Deadline (Pre-Examination)',
			templateType: 'procedural-deadline'
		}
	}
];

export const fixtureTimetableItemsWelshCase = [
	{
		id: 1,
		examinationTypeId: 2,
		name: 'name in english',
		description: '{"preText":"english description","bulletPoints":["ponintone", "pointtwo"]}',
		nameWelsh: 'name in welsh',
		descriptionWelsh: '{"preText":"welsh description","bulletPoints":["ponintone", "pointtwo"]}',
		date: '2023-10-10T09:10:00.000Z',
		startDate: '2023-10-10T09:10:00.000Z',
		endDate: null,
		examinationTimetableId: 1,
		ExaminationTimetableType: {
			id: 2,
			name: 'Deadline',
			templateType: 'deadline'
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

export const fixtureTimetableWelshCase = {
	id: 1,
	caseId: 1,
	published: true,
	publishedAt: '2023-10-10T00:00:00.000Z',
	updatedAt: '2023-10-11T00:00:00.000Z',
	createdAt: '2023-10-11T00:00:00.000Z',
	items: fixtureTimetableItemsWelshCase
};
