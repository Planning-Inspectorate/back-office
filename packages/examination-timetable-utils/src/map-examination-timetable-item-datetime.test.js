import { mapExaminationTimetableItemDateTime } from './map-examination-timetable-item-datetime';

describe('mapExaminationTimetableItemDateTime', () => {
	describe('When event type is not supported', () => {
		it('throws an error', () => {
			expect(() =>
				mapExaminationTimetableItemDateTime(
					{
						startDate: null,
						date: new Date('2025-02-01'),
						startTime: '12:00',
						endTime: '18:00'
					},
					'Unsupported Type'
				)
			).toThrow('Unsupported examination timetable item type: Unsupported Type');
		});
	});
	describe.each([
		'Accompanied Site Inspection',
		'Compulsory Acquisition Hearing',
		'Issue Specific Hearing',
		'Open Floor Hearing',
		'Other Meeting'
	])('When event type is "%s"', (timetableType) => {
		test.each([
			[
				{ startDate: null, startTime: '12:00', date: new Date('2025-02-01'), endTime: '18:00' },
				{ startDate: '2025-02-01T12:00:00.000Z', date: '2025-02-01T18:00:00.000Z' }
			],
			[
				{ startDate: null, startTime: '12:00', date: new Date('2025-02-01'), endTime: null },
				{ startDate: '2025-02-01T12:00:00.000Z', date: '2025-02-01T00:00:00.000Z' }
			],
			[
				{ startDate: null, startTime: null, date: new Date('2025-02-01'), endTime: '18:00' },
				{ startDate: null, date: '2025-02-01T18:00:00.000Z' }
			],
			[
				{ startDate: null, startTime: null, date: new Date('2025-02-01'), endTime: null },
				{ startDate: null, date: '2025-02-01T00:00:00.000Z' }
			]
		])('given %o as input, returns %o', (input, expected) => {
			const result = mapExaminationTimetableItemDateTime(input, timetableType);
			expect(result).toEqual(expected);
		});
	});

	describe.each(['Publication Of', 'Issued By'])('When event type is "%s"', (timetableType) => {
		test.each([
			[
				{ startDate: null, startTime: null, date: new Date('2025-02-01'), endTime: null },
				{ startDate: null, date: '2025-02-01T00:00:00.000Z' }
			]
		])('given %o as input, returns %o', (input, expected) => {
			const result = mapExaminationTimetableItemDateTime(input, timetableType);
			expect(result).toEqual(expected);
		});
	});

	describe.each(['Preliminary Meeting'])('When event type is "%s"', (timetableType) => {
		test.each([
			[
				{
					startDate: null,
					startTime: '12:00',
					date: new Date('2025-02-01'),
					endTime: '18:00'
				},
				{ startDate: '2025-02-01T12:00:00.000Z', date: '2025-02-01T18:00:00.000Z' }
			],
			[
				{
					startDate: null,
					startTime: '12:00',
					date: new Date('2025-02-01'),
					endTime: null
				},
				{ startDate: '2025-02-01T12:00:00.000Z', date: '2025-02-01T00:00:00.000Z' }
			]
		])('given %o as input, returns %o', (input, expected) => {
			const result = mapExaminationTimetableItemDateTime(input, timetableType);
			expect(result).toEqual(expected);
		});
	});

	describe.each([
		'Deadline',
		'Deadline For Close Of Examination',
		'Procedural Deadline (Pre-Examination)'
	])('When event type is "%s"', (timetableType) => {
		test.each([
			[
				{
					startDate: new Date('2025-02-01'),
					startTime: '12:00',
					date: new Date('2025-02-02'),
					endTime: '18:00'
				},
				{ startDate: '2025-02-01T12:00:00.000Z', date: '2025-02-02T18:00:00.000Z' }
			],
			[
				{
					startDate: new Date('2025-02-01'),
					startTime: null,
					date: new Date('2025-02-02'),
					endTime: '18:00'
				},
				{ startDate: '2025-02-01T00:00:00.000Z', date: '2025-02-02T18:00:00.000Z' }
			],
			[
				{ startDate: null, startTime: '12:00', date: new Date('2025-02-02'), endTime: '18:00' },
				{ startDate: '2025-02-02T12:00:00.000Z', date: '2025-02-02T18:00:00.000Z' }
			],
			[
				{ startDate: null, startTime: null, date: new Date('2025-02-02'), endTime: '18:00' },
				{ startDate: null, date: '2025-02-02T18:00:00.000Z' }
			]
		])('given %o as input, returns %o', (input, expected) => {
			const result = mapExaminationTimetableItemDateTime(input, timetableType);
			expect(result).toEqual(expected);
		});
	});
});
