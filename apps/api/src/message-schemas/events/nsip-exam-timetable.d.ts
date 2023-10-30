/**
 * nsip-exam-timetable schema for use in code
 */

export interface NSIPExamTimetableItemDescriptionLineItem {
	eventLineItemId?: number;
	eventLineItemDescription: string;
}

export interface NSIPExamTimetableItem {
	eventId?: number;
	type:
		| 'Accompanied Site Inspection'
		| 'Compulsory Acquisition Hearing'
		| 'Deadline'
		| 'Deadline For Close Of Examination'
		| 'Issued By'
		| 'Issue Specific Hearing'
		| 'Open Floor Hearing'
		| 'Other Meeting'
		| 'Preliminary Meeting'
		| 'Procedural Deadline (Pre-Examination)'
		| 'Procedural Decision'
		| 'Publication Of';
	eventTitle: string;
	description: string;
	eventDeadlineStartDate?: string;
	date: string;
	eventLineItems?: { description: string }[];
}

export interface NSIPExamTimetable {
	caseReference: string;
	events: NSIPExamTimetableItem;
}
