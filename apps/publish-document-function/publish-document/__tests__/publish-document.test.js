// @ts-nocheck
// import { jest } from '@jest/globals';

import { publishDocument } from '../publish-document.js';

class Context {
	constructor() {
		this.log = () => {
			jest.fn();
		};
		this.log.verbose = () => {
			jest.fn();
		};
		this.log.info = () => {
			jest.fn();
		};
		this.log.warn = () => {
			jest.fn();
		};
		this.log.error = () => {
			jest.fn();
		};
	}
}

describe('Publishing document', () => {
	test(
		'Newly received document ' +
			'is copied over to the public blob storage container ' +
			'applications front office notified and back office notified',
		async () => {
			// GIVEN
			const caseReference = 'some-case-reference';
			const documentContainer = 'some-container';
			const documentPath = 'some-path';

			// WHEN
			await publishDocument(new Context(), {
				caseReference,
				documentContainer,
				documentPath
			});

			// THEN
			expect(blobStorageClient).toHaveBeenCalledOnce();
			expect(backOfficeApiClient).toHaveBeenCalledOnce();
		}
	);

	test.todo(
		'A document that has already been copied over to the public blob storage container ' +
			'should not block notification to applications front office and back office'
	);
});
