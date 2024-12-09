import {
	mapCaseStatus,
	mapDocumentCaseStageToSchema,
	mapProjectCaseStageToDocumentCaseStageSchema
} from '../map-case-status';

describe('mapCaseStatus', () => {
	it('should throw an error if caseStatuses is null', () => {
		expect(() => mapCaseStatus(null)).toThrow('No Case Statuses Provided');
	});

	it('should throw an error if caseStatuses is not an array', () => {
		// @ts-ignore
		expect(() => mapCaseStatus('not an array')).toThrow('No Case Statuses Provided');
	});

	it('should throw an error if no valid status is found', () => {
		const caseStatuses = [
			{
				id: 1,
				status: 'invalid',
				createdAt: new Date('2024-02-21T17:53:45.407Z'),
				valid: false,
				subStateMachineName: null,
				compoundStateName: null,
				caseId: 100000001
			}
		];
		expect(() => mapCaseStatus(caseStatuses)).toThrow(
			'No `Case status` with valid status provided'
		);
	});

	it('should return the mapped case status string for a valid status', () => {
		const caseStatuses = [
			{
				id: 71,
				status: 'pre_application',
				createdAt: new Date('2024-02-21T17:53:45.407Z'),
				valid: true,
				subStateMachineName: null,
				compoundStateName: null,
				caseId: 100000001
			}
		];
		const result = mapCaseStatus(caseStatuses);
		expect(result).toBe('Pre-Application');
	});
});

describe('mapDocumentCaseStageToSchema', () => {
	it('should return null if stage is null', () => {
		expect(mapDocumentCaseStageToSchema(null)).toBeNull();
	});

	it('should return the correct schema value for DEVELOPERS_APPLICATION', () => {
		expect(mapDocumentCaseStageToSchema("Developer's Application")).toBe('developers_application');
	});

	it('should return the correct schema value for POST_DECISION', () => {
		expect(mapDocumentCaseStageToSchema('Post-decision')).toBe('post_decision');
	});

	it('should return the lowercased stage for other values', () => {
		expect(mapDocumentCaseStageToSchema('Decision')).toBe('decision');
	});

	it('should return the null stage for null value', () => {
		expect(mapDocumentCaseStageToSchema(null)).toBe(null);
	});
});

describe('mapProjectCaseStageToDocumentCaseStageSchema', () => {
	it('should return the correct schema value for a given case stage - decision', () => {
		expect(mapProjectCaseStageToDocumentCaseStageSchema('decision')).toBe('decision');
	});

	it('should return the correct schema value for a special hyphenated schema  case stage - pre_examination', () => {
		expect(mapProjectCaseStageToDocumentCaseStageSchema('pre_examination')).toBe('pre-examination');
	});

	it('should return the correct schema value for a special hyphenated schema case stage - pre_application', () => {
		expect(mapProjectCaseStageToDocumentCaseStageSchema('pre_application')).toBe('pre-application');
	});

	it('should return undefined for an unknown case stage', () => {
		expect(mapProjectCaseStageToDocumentCaseStageSchema('unknownCaseStage')).toBeUndefined();
	});
});
