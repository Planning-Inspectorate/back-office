export interface ApplicationsTimetableCreateBody extends Record<string, string | undefined> {
	timetableId?: string;
	name: string;
	templateType: string;
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
	timetableTypeId: string;
}

export interface ExaminationTimetableType {
	id: number;
	name: string;
	templateType: string;
}

export interface ApplicationExaminationTimetableItem {
	id?: number;
	examinationTimetableId: number;
	examinationTypeId: number;
	name: string;
	description: string;
	date: Date;
	startDate: Date | null;
	startTime: string | null;
	endTime: string | null;
	submissions?: boolean;
	ExaminationTimetableType: ExaminationTimetableType;
}

export interface ApplicationsTimetablePayload {
	id?: number;
	examinationTypeId: number;
	name: string;
	description: string;
	date: Date;
	startDate: Date | null;
	startTime: string | null;
	endTime: string | null;
	submissions?: boolean;
	caseId: number;
}
export interface ApplicationsTimetable extends ApplicationsTimetablePayload {
	ExaminationTimetableType: ExaminationTimetableType;
}
export interface ApplicationExaminationTimetable {
	id: number;
	published: boolean;
	publishedAt?: DateTime;
	updatedAt: DateTime;
	caseId: number;
	items: ApplicationExaminationTimetableItem[];
}
