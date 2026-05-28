// @ts-nocheck
import fc from 'fast-check';
import { compareFields } from '../file-props-wipe-poc.controller.js';

/**
 * Property 2: Field comparison correctness
 *
 * For any two objects representing document version records and any list of
 * field names to compare, the compareFields function SHALL return exactly the
 * set of fields whose values differ between the two objects (no false positives,
 * no false negatives).
 *
 * **Validates: Requirements 5.3**
 */
describe('compareFields - Property 2: Field comparison correctness', () => {
	/** Arbitrary that produces nullable scalar values (matching the ?? null coalescing in compareFields) */
	const scalarArb = fc.oneof(
		fc.string(),
		fc.integer(),
		fc.constant(null),
		fc.constant(undefined),
		fc.boolean()
	);

	it('should return exactly the fields that differ between before and after (no false positives, no false negatives)', () => {
		fc.assert(
			fc.property(
				fc.dictionary(fc.string({ minLength: 1, maxLength: 10 }), scalarArb),
				fc.dictionary(fc.string({ minLength: 1, maxLength: 10 }), scalarArb),
				fc.array(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 0, maxLength: 15 }),
				(before, after, fieldsToCompare) => {
					const result = compareFields(before, after, fieldsToCompare);

					// Compute expected diffs manually using the same ?? null semantics
					const expectedDiffs = fieldsToCompare.filter((field) => {
						const beforeVal = before[field] ?? null;
						const afterVal = after[field] ?? null;
						return beforeVal !== afterVal;
					});

					// No false negatives: every field that actually differs must appear in result
					const resultFields = result.map((d) => d.field);
					for (const field of expectedDiffs) {
						expect(resultFields).toContain(field);
					}

					// No false positives: every field in result must actually differ
					for (const diff of result) {
						expect(expectedDiffs).toContain(diff.field);
					}

					// Exact count match
					expect(result.length).toBe(expectedDiffs.length);

					// Each diff entry has correct before/after values
					for (const diff of result) {
						expect(diff.before).toBe(before[diff.field] ?? null);
						expect(diff.after).toBe(after[diff.field] ?? null);
					}
				}
			),
			{ numRuns: 200 }
		);
	});

	it('should return empty array when before and after are identical for all compared fields', () => {
		fc.assert(
			fc.property(
				fc.dictionary(fc.string({ minLength: 1, maxLength: 10 }), scalarArb),
				fc.array(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 0, maxLength: 10 }),
				(obj, fieldsToCompare) => {
					// Use the same object for both before and after
					const result = compareFields(obj, obj, fieldsToCompare);
					expect(result).toEqual([]);
				}
			),
			{ numRuns: 100 }
		);
	});

	it('should treat undefined and null as equal (both coalesce to null via ?? null)', () => {
		fc.assert(
			fc.property(
				fc.array(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 1, maxLength: 10 }),
				(fields) => {
					// Build before with undefined values and after with null values
					const before = Object.fromEntries(fields.map((f) => [f, undefined]));
					const after = Object.fromEntries(fields.map((f) => [f, null]));

					const result = compareFields(before, after, fields);

					// undefined ?? null === null, and null ?? null === null, so no diffs expected
					expect(result).toEqual([]);
				}
			),
			{ numRuns: 100 }
		);
	});
});
