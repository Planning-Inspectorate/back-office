import {
	mapExaminationTimetableItemDescriptionToSave,
	mapExaminationTimetableItemDescriptionToView
} from '#utils/mapping/map-examination-timetable-item-description.js';

describe('mapExaminationTimetableItemDescriptionToSave', () => {
	it('removes trailing line breaks as expected', () => {
		const originalDescription = `{"preText":"List items\\r\\n","bulletPoints":[" item 1\\r\\n"," item 2\\r\\n"," item 3"]}`;
		const expectedDescription = `{"preText":"List items","bulletPoints":["item 1","item 2","item 3"]}`;
		expect(mapExaminationTimetableItemDescriptionToSave(originalDescription)).toBe(
			expectedDescription
		);
	});
});

describe('mapExaminationTimetableItemDescriptionToView', () => {
	it('adds trailing line breaks as expected', () => {
		const originalDescription = `{"preText":"List items","bulletPoints":["item 1","item 2","item 3"]}`;
		const expectedDescription = `{"preText":"List items\\r\\n","bulletPoints":[" item 1\\r\\n"," item 2\\r\\n"," item 3"]}`;
		expect(mapExaminationTimetableItemDescriptionToView(originalDescription)).toBe(
			expectedDescription
		);
	});
});
