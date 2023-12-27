export interface DecisionOutcome {
	outcome: string;
	documentGuid: string;
	documentDate: string;
}

export interface InspectorDecisionRequest {
	outcome?: string;
	documentId?: string;
	letterDate?: Date | null;
}
