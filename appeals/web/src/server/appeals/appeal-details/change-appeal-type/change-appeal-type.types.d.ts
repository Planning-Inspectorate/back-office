export interface ChangeAppealTypeRequest {
	appealTypeId: number;
	resubmit?: boolean;
	appealTypeFinalDate?: Date | null;
}

export interface AppealType {
	id: number;
	type: string;
	shorthand: string;
	code: string;
}
