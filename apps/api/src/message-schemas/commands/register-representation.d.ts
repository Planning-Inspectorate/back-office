export interface RegisterRepresentation {
	referenceId: string;
	caseReference: string;
	representationType?: string;
	originalRepresentation: string;
	representationFrom: string;
	registerFor: string;
	represented: object;
	representative: object;
	dateReceived?: string;
}
