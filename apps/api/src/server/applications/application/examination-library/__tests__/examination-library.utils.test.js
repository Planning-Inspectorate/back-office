import {
	generateDraftExaminationLibraryReferences,
	addDraftExaminationLibraryReferences,
	sortExaminationLibraryDocuments
} from '../examination-library.utils.js';

const createDocument = ({
	guid,
	typeOfParty = null,
	author = null,
	description = null,
	publishedStatus = 'in progress',
	examinationRefNo = null,
	examinationLibraryReferenceLocked = false,
	categoryCode = 'APP'
}) => ({
	guid,
	latestDocumentVersion: {
		typeOfParty,
		author,
		description,
		publishedStatus,
		examinationRefNo,
		examinationLibraryReferenceLocked,
		ExaminationLibraryCategory: {
			categoryCode
		}
	}
});

describe('default sort', () => {
	it('sorts documents by the defined party type hierarchy', () => {
		const documents = [
			createDocument({
				guid: 'individual',
				typeOfParty: 'Individual'
			}),
			createDocument({
				guid: 'planning-inspectorate',
				typeOfParty: 'Planning Inspectorate'
			}),
			createDocument({
				guid: 'applicant',
				typeOfParty: 'Applicant'
			}),
			createDocument({
				guid: 'interested-organisation',
				typeOfParty: 'Interested organisation'
			}),
			createDocument({
				guid: 'other-council',
				typeOfParty: 'Other council'
			}),
			createDocument({
				guid: 'statutory-body',
				typeOfParty: 'Statutory body'
			}),
			createDocument({
				guid: 'local-authority',
				typeOfParty: 'Local authority'
			})
		];

		const result = sortExaminationLibraryDocuments(documents);

		expect(result.map(({ guid }) => guid)).toEqual([
			'applicant',
			'local-authority',
			'other-council',
			'statutory-body',
			'interested-organisation',
			'individual',
			'planning-inspectorate'
		]);
	});

	it('sorts documents by author within the same party type', () => {
		const documents = [
			createDocument({
				guid: 'charlie',
				typeOfParty: 'Applicant',
				author: 'Charlie Ltd'
			}),
			createDocument({
				guid: 'alpha',
				typeOfParty: 'Applicant',
				author: 'Alpha Ltd'
			}),
			createDocument({
				guid: 'bravo',
				typeOfParty: 'Applicant',
				author: 'Bravo Ltd'
			})
		];

		const result = sortExaminationLibraryDocuments(documents);

		expect(result.map(({ guid }) => guid)).toEqual(['alpha', 'bravo', 'charlie']);
	});

	it('sorts documents by description within the same party type and author', () => {
		const documents = [
			createDocument({
				guid: 'response',
				typeOfParty: 'Applicant',
				author: 'Applicant Ltd',
				description: 'Response'
			}),
			createDocument({
				guid: 'cover-letter',
				typeOfParty: 'Applicant',
				author: 'Applicant Ltd',
				description: 'Cover letter'
			}),
			createDocument({
				guid: 'application-form',
				typeOfParty: 'Applicant',
				author: 'Applicant Ltd',
				description: 'Application form'
			})
		];

		const result = sortExaminationLibraryDocuments(documents);

		expect(result.map(({ guid }) => guid)).toEqual([
			'application-form',
			'cover-letter',
			'response'
		]);
	});

	it('places documents with no party type after documents with a party type', () => {
		const documents = [
			createDocument({
				guid: 'missing',
				typeOfParty: null
			}),
			createDocument({
				guid: 'planning',
				typeOfParty: 'Planning Inspectorate'
			}),
			createDocument({
				guid: 'applicant',
				typeOfParty: 'Applicant'
			})
		];

		const result = sortExaminationLibraryDocuments(documents);

		expect(result.map(({ guid }) => guid)).toEqual(['applicant', 'planning', 'missing']);
	});

	it('places documents with no author last within the same party type', () => {
		const documents = [
			createDocument({
				guid: 'missing',
				typeOfParty: 'Applicant',
				author: null
			}),
			createDocument({
				guid: 'bravo',
				typeOfParty: 'Applicant',
				author: 'Bravo Ltd'
			}),
			createDocument({
				guid: 'alpha',
				typeOfParty: 'Applicant',
				author: 'Alpha Ltd'
			})
		];

		const result = sortExaminationLibraryDocuments(documents);

		expect(result.map(({ guid }) => guid)).toEqual(['alpha', 'bravo', 'missing']);
	});

	it('places documents with no description last within the same party type and author', () => {
		const documents = [
			createDocument({
				guid: 'missing',
				typeOfParty: 'Applicant',
				author: 'Applicant Ltd',
				description: null
			}),
			createDocument({
				guid: 'response',
				typeOfParty: 'Applicant',
				author: 'Applicant Ltd',
				description: 'Response'
			}),
			createDocument({
				guid: 'cover-letter',
				typeOfParty: 'Applicant',
				author: 'Applicant Ltd',
				description: 'Cover letter'
			})
		];

		const result = sortExaminationLibraryDocuments(documents);

		expect(result.map(({ guid }) => guid)).toEqual(['cover-letter', 'response', 'missing']);
	});

	it('applies the complete default Examination Library sort hierarchy', () => {
		const documents = [
			createDocument({
				guid: 'individual-zebra-response',
				typeOfParty: 'Individual',
				author: 'Zebra',
				description: 'Response'
			}),
			createDocument({
				guid: 'applicant-zulu-plan',
				typeOfParty: 'Applicant',
				author: 'Zulu Developments',
				description: 'Plan'
			}),
			createDocument({
				guid: 'local-beta-statement',
				typeOfParty: 'Local authority',
				author: 'Beta Council',
				description: 'Statement'
			}),
			createDocument({
				guid: 'applicant-alpha-response',
				typeOfParty: 'Applicant',
				author: 'Alpha Developments',
				description: 'Response'
			}),
			createDocument({
				guid: 'individual-alpha-letter',
				typeOfParty: 'Individual',
				author: 'Alpha Person',
				description: 'Letter'
			}),
			createDocument({
				guid: 'local-alpha-response',
				typeOfParty: 'Local authority',
				author: 'Alpha Council',
				description: 'Response'
			}),
			createDocument({
				guid: 'applicant-alpha-cover',
				typeOfParty: 'Applicant',
				author: 'Alpha Developments',
				description: 'Cover letter'
			}),
			createDocument({
				guid: 'individual-alpha-comments',
				typeOfParty: 'Individual',
				author: 'Alpha Person',
				description: 'Comments'
			}),
			createDocument({
				guid: 'local-alpha-letter',
				typeOfParty: 'Local authority',
				author: 'Alpha Council',
				description: 'Letter'
			})
		];

		const result = sortExaminationLibraryDocuments(documents);

		expect(result.map(({ guid }) => guid)).toEqual([
			// Applicant
			'applicant-alpha-cover',
			'applicant-alpha-response',
			'applicant-zulu-plan',

			// Local authority
			'local-alpha-letter',
			'local-alpha-response',
			'local-beta-statement',

			// Individual
			'individual-alpha-comments',
			'individual-alpha-letter',
			'individual-zebra-response'
		]);
	});
});

describe('user-selected sort', () => {
	it('sorts all documents by description rather than retaining the default hierarchy', () => {
		const documents = [
			createDocument({
				guid: 'applicant-response',
				typeOfParty: 'Applicant',
				author: 'Alpha',
				description: 'Response'
			}),
			createDocument({
				guid: 'individual-application',
				typeOfParty: 'Individual',
				author: 'Zulu',
				description: 'Application'
			}),
			createDocument({
				guid: 'local-letter',
				typeOfParty: 'Local authority',
				author: 'Bravo',
				description: 'Letter'
			})
		];

		const result = sortExaminationLibraryDocuments(documents, [{ description: 'asc' }]);

		expect(result.map(({ guid }) => guid)).toEqual([
			'individual-application',
			'local-letter',
			'applicant-response'
		]);
	});
	it.each([
		['description', 'description'],
		['author', 'author'],
		['publishedStatus', 'publishedStatus'],
		['examinationRefNo', 'examinationRefNo']
	])('sorts by %s', (sortField, documentField) => {
		const documents = [
			createDocument({
				guid: 'charlie',
				[documentField]: 'Charlie'
			}),
			createDocument({
				guid: 'alpha',
				[documentField]: 'Alpha'
			}),
			createDocument({
				guid: 'bravo',
				[documentField]: 'Bravo'
			})
		];

		const result = sortExaminationLibraryDocuments(documents, [{ [sortField]: 'asc' }]);

		expect(result.map(({ guid }) => guid)).toEqual(['alpha', 'bravo', 'charlie']);
	});
	it('sorts descending when requested', () => {
		const documents = [
			createDocument({ guid: 'alpha', description: 'Alpha' }),
			createDocument({ guid: 'charlie', description: 'Charlie' }),
			createDocument({ guid: 'bravo', description: 'Bravo' })
		];

		const result = sortExaminationLibraryDocuments(documents, [{ description: 'desc' }]);

		expect(result.map(({ guid }) => guid)).toEqual(['charlie', 'bravo', 'alpha']);
	});
});

describe('generateDraftExaminationLibraryReferences', () => {
	it('should generate draft examination library references in document order', () => {
		const documents = [
			{
				guid: 'doc-1',
				latestDocumentVersion: {
					ExaminationLibraryCategory: {
						categoryCode: 'REP2'
					}
				}
			},
			{
				guid: 'doc-2',
				latestDocumentVersion: {
					ExaminationLibraryCategory: {
						categoryCode: 'REP2'
					}
				}
			},
			{
				guid: 'doc-3',
				latestDocumentVersion: {
					ExaminationLibraryCategory: {
						categoryCode: 'REP2'
					}
				}
			}
		];

		const result = generateDraftExaminationLibraryReferences(documents);

		expect(
			result.map((document) => document.latestDocumentVersion.draftExaminationLibraryReference)
		).toEqual(['REP2-001', 'REP2-002', 'REP2-003']);
	});

	it('should pad reference numbers to three digits', () => {
		const documents = Array.from({ length: 10 }, (_, index) => ({
			guid: `doc-${index + 1}`,
			latestDocumentVersion: {
				ExaminationLibraryCategory: {
					categoryCode: 'APP'
				}
			}
		}));

		const result = generateDraftExaminationLibraryReferences(documents);

		expect(result[0].latestDocumentVersion.draftExaminationLibraryReference).toBe('APP-001');

		expect(result[9].latestDocumentVersion.draftExaminationLibraryReference).toBe('APP-010');
	});

	it('should generate draft references from the supplied starting reference number', () => {
		const documents = [
			createDocument({ guid: 'doc-1', categoryCode: 'APP' }),
			createDocument({ guid: 'doc-2', categoryCode: 'APP' })
		];

		const result = generateDraftExaminationLibraryReferences(documents, 13);

		expect(
			result.map((document) => document.latestDocumentVersion.draftExaminationLibraryReference)
		).toEqual(['APP-013', 'APP-014']);
	});

	it('should not generate a draft reference when a document has an examination reference', () => {
		const documents = [
			createDocument({
				guid: 'doc-1',
				examinationRefNo: 'APP-001a'
			})
		];

		const result = generateDraftExaminationLibraryReferences(documents);

		expect(result[0].latestDocumentVersion.draftExaminationLibraryReference).toBeUndefined();

		expect(result[0].latestDocumentVersion.examinationRefNo).toBe('APP-001a');
	});

	it('should not increment the draft reference index for a document with an examination reference', () => {
		const documents = [
			createDocument({
				guid: 'manual',
				examinationRefNo: 'APP-001a'
			}),
			createDocument({
				guid: 'automatic-1'
			}),
			createDocument({
				guid: 'automatic-2'
			})
		];

		const result = generateDraftExaminationLibraryReferences(documents);

		expect(
			result.map((document) => document.latestDocumentVersion.draftExaminationLibraryReference)
		).toEqual([undefined, 'APP-001', 'APP-002']);
	});
});

describe('addDraftExaminationLibraryReferences', () => {
	it('should generate draft references after the highest locked reference', () => {
		const documents = [
			createDocument({
				guid: 'locked-1',
				examinationRefNo: 'APP-001',
				examinationLibraryReferenceLocked: true
			}),
			createDocument({
				guid: 'locked-2',
				examinationRefNo: 'APP-002',
				examinationLibraryReferenceLocked: true
			}),
			createDocument({
				guid: 'locked-3',
				examinationRefNo: 'APP-003',
				examinationLibraryReferenceLocked: true
			}),
			createDocument({
				guid: 'new-1',
				typeOfParty: 'Applicant',
				author: 'Alpha'
			}),
			createDocument({
				guid: 'new-2',
				typeOfParty: 'Local authority',
				author: 'Bravo'
			})
		];

		const result = addDraftExaminationLibraryReferences(documents);

		const newDocuments = result.filter(
			(document) => !document.latestDocumentVersion.examinationLibraryReferenceLocked
		);

		expect(
			newDocuments.map(
				(document) => document.latestDocumentVersion.draftExaminationLibraryReference
			)
		).toEqual(['APP-004', 'APP-005']);
	});

	it('should use the highest locked reference number when determining the next draft reference', () => {
		const documents = [
			createDocument({
				guid: 'locked-1',
				examinationRefNo: 'APP-003',
				examinationLibraryReferenceLocked: true
			}),
			createDocument({
				guid: 'locked-2',
				examinationRefNo: 'APP-012',
				examinationLibraryReferenceLocked: true
			}),
			createDocument({
				guid: 'locked-3',
				examinationRefNo: 'APP-007',
				examinationLibraryReferenceLocked: true
			}),
			createDocument({
				guid: 'new'
			})
		];

		const result = addDraftExaminationLibraryReferences(documents);

		const newDocument = result.find((document) => document.guid === 'new');

		expect(newDocument.latestDocumentVersion.draftExaminationLibraryReference).toBe('APP-013');
	});

	it('should ignore reference suffixes when determining the next draft reference number', () => {
		const documents = [
			createDocument({
				guid: 'locked-1',
				examinationRefNo: 'APP-004',
				examinationLibraryReferenceLocked: true
			}),
			createDocument({
				guid: 'locked-2',
				examinationRefNo: 'APP-004a',
				examinationLibraryReferenceLocked: true
			}),
			createDocument({
				guid: 'new'
			})
		];

		const result = addDraftExaminationLibraryReferences(documents);

		const newDocument = result.find((document) => document.guid === 'new');

		expect(newDocument.latestDocumentVersion.draftExaminationLibraryReference).toBe('APP-005');
	});
});
