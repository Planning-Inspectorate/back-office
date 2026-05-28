// @ts-nocheck
import fc from 'fast-check';
import { validateInputs } from '../file-props-wipe-poc.controller.js';

/**
 * Property 3: Required field validation rejects empty inputs
 *
 * For any form submission where case ID is empty/whitespace-only OR folder ID
 * is empty/whitespace-only, the validateInputs function SHALL return a non-null
 * error object containing an error message for each missing field, and SHALL
 * never return null.
 *
 * **Validates: Requirements 6.3**
 */
describe('validateInputs - Property 3: Required field validation rejects empty inputs', () => {
	/** Arbitrary that generates empty or whitespace-only strings */
	const emptyOrWhitespaceArb = fc.oneof(
		fc.constant(''),
		fc.constant(undefined),
		fc.constant(null),
		fc.stringOf(fc.constant(' '), { minLength: 1, maxLength: 20 }),
		fc.stringOf(fc.constantFrom(' ', '\t', '\n', '\r'), { minLength: 1, maxLength: 10 })
	);

	/** Arbitrary that generates valid non-empty, non-whitespace strings */
	const validStringArb = fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0);

	it('should return a non-null error object when caseId is empty/whitespace', () => {
		fc.assert(
			fc.property(emptyOrWhitespaceArb, validStringArb, (caseId, folderId) => {
				const result = validateInputs(caseId, folderId);

				expect(result).not.toBeNull();
				expect(result).toHaveProperty('caseId');
				expect(typeof result.caseId).toBe('string');
				expect(result.caseId.length).toBeGreaterThan(0);
			}),
			{ numRuns: 500 }
		);
	});

	it('should return a non-null error object when folderId is empty/whitespace', () => {
		fc.assert(
			fc.property(validStringArb, emptyOrWhitespaceArb, (caseId, folderId) => {
				const result = validateInputs(caseId, folderId);

				expect(result).not.toBeNull();
				expect(result).toHaveProperty('folderId');
				expect(typeof result.folderId).toBe('string');
				expect(result.folderId.length).toBeGreaterThan(0);
			}),
			{ numRuns: 500 }
		);
	});

	it('should return errors for both fields when both are empty/whitespace', () => {
		fc.assert(
			fc.property(emptyOrWhitespaceArb, emptyOrWhitespaceArb, (caseId, folderId) => {
				const result = validateInputs(caseId, folderId);

				expect(result).not.toBeNull();
				expect(result).toHaveProperty('caseId');
				expect(result).toHaveProperty('folderId');
			}),
			{ numRuns: 500 }
		);
	});
});
