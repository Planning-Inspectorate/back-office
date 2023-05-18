export interface ApplicationsTimetableCreateBody extends Record<string, string | undefined> {
	name: string;
	description: string;
	itemTypeName: string;
	'date.day'?: string;
	'date.month'?: string;
	'date.year'?: string;
	'startDate.day'?: string;
	'startDate.month'?: string;
	'startDate.year'?: string;
	'endDate.day'?: string;
	'endDate.month'?: string;
	'endDate.year'?: string;
	'starTime.hours'?: string;
	'starTime.minutes'?: string;
	'endTime.hours'?: string;
	'endTime.minutes'?: string;
}
