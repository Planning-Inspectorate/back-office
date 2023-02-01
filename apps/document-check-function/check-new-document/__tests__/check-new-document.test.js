// @ts-nocheck
import { jest } from '@jest/globals';
import got, { HTTPError } from 'got';
import { randomUUID } from 'node:crypto';
import { checkMyBlob } from '../check-my-blob.js';
import { clamAvClient } from '../clam-av-client.js';

const mockGotPatch = jest.spyOn(got, 'patch');
const mockGotDelete = jest.spyOn(got, 'delete');
const mockClamAvScanStream = jest.spyOn(clamAvClient, 'scanStream');

// Mock Errors

const denerateHttpError = (body, statusCode) => {
	const response = { body, statusCode };
	const error = new HTTPError(response);

	error.response = response;

	return error;
};

const backOfficeFailedToMarkAsUploadedError = denerateHttpError(
	'{"errors":{"application":"Could not transition \'awaiting_virus_check\' using \'uploading\'."}}',
	409
);

const backOfficeFailedToMarkAsPassedAVError = denerateHttpError(
	'{"errors":{"application":"Could not transition \'not_user_checked\' using \'check_success\'."}}',
	409
);

const backOfficeFailedToMarkAsFailedAVError = denerateHttpError(
	'{"errors":{"application":"Could not transition \'failed_virus_check\' using \'check_fail\'."}}',
	409
);

const documentStorageFailedToDeleteError = denerateHttpError(
	'{"errors":{"documentPath":"Document does not exist in Blob Storage"}}',
	404
);

// End Mock Errors

const documentBuffer = Buffer.alloc(0);

class Context {
	constructor(bindingData) {
		this.bindingData = bindingData;
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

const blobHostUrl = 'https://blobhost/container';

beforeEach(() => {
	jest.clearAllMocks();
});

describe('document passes AV checks', () => {
	test("sends 'passed' machine action to back office API", async () => {
		// GIVEN
		const documentGuid = randomUUID();

		mockGotPatch.mockResolvedValueOnce({}).mockResolvedValueOnce({});
		mockClamAvScanStream.mockResolvedValueOnce({ isInfected: false });

		// WHEN
		await checkMyBlob(
			new Context({ uri: `${blobHostUrl}/application/ABC/${documentGuid}/test.pdf` }),
			documentBuffer
		);

		// THEN
		expect(mockGotPatch).toHaveBeenCalledTimes(2);
		expect(mockGotPatch).toHaveBeenNthCalledWith(
			1,
			`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
			{ json: { machineAction: 'uploading' } }
		);
		expect(mockGotPatch).toHaveBeenNthCalledWith(
			2,
			`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
			{ json: { machineAction: 'check_success' } }
		);
		expect(mockClamAvScanStream).toHaveBeenCalledTimes(1);
	});

	describe('if document has already been marked as uploaded in Back Office API', () => {
		test("still sends 'passed' machine action to back office API", async () => {
			// GIVEN
			const documentGuid = randomUUID();

			mockGotPatch
				.mockRejectedValueOnce(backOfficeFailedToMarkAsUploadedError)
				.mockResolvedValueOnce({});
			mockClamAvScanStream.mockResolvedValueOnce({ isInfected: false });

			// WHEN
			await checkMyBlob(
				new Context({ uri: `${blobHostUrl}/application/ABC/${documentGuid}/test.pdf` }),
				documentBuffer
			);

			// THEN
			expect(mockGotPatch).toHaveBeenCalledTimes(2);
			expect(mockGotPatch).toHaveBeenNthCalledWith(
				1,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{ json: { machineAction: 'uploading' } }
			);
			expect(mockGotPatch).toHaveBeenNthCalledWith(
				2,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{ json: { machineAction: 'check_success' } }
			);
			expect(mockClamAvScanStream).toHaveBeenCalledTimes(1);
		});
	});

	describe('if document has already been marked as passed AV checks', () => {
		test('completes without issues', async () => {
			const documentGuid = randomUUID();

			mockGotPatch
				.mockResolvedValueOnce({})
				.mockRejectedValueOnce(backOfficeFailedToMarkAsPassedAVError);
			mockClamAvScanStream.mockResolvedValueOnce({ isInfected: false });

			// WHEN
			await checkMyBlob(
				new Context({ uri: `${blobHostUrl}/application/ABC/${documentGuid}/test.pdf` }),
				documentBuffer
			);

			// THEN
			expect(mockGotPatch).toHaveBeenCalledTimes(2);
			expect(mockGotPatch).toHaveBeenNthCalledWith(
				1,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{ json: { machineAction: 'uploading' } }
			);
			expect(mockGotPatch).toHaveBeenNthCalledWith(
				2,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{ json: { machineAction: 'check_success' } }
			);
			expect(mockClamAvScanStream).toHaveBeenCalledTimes(1);
		});
	});
});

describe('document fails AV checks', () => {
	test("sends 'failed' machine action to back office API and deleted blob from blob storage", async () => {
		// GIVEN
		const documentGuid = randomUUID();
		const documentPath = `/application/ABC/${documentGuid}/test.pdf`;

		mockGotPatch.mockResolvedValueOnce({}).mockResolvedValueOnce({});
		mockGotDelete.mockResolvedValueOnce({});
		mockClamAvScanStream.mockResolvedValueOnce({ isInfected: true });

		// WHEN
		await checkMyBlob(new Context({ uri: `${blobHostUrl}${documentPath}` }), documentBuffer);

		// THEN
		expect(mockGotPatch).toHaveBeenCalledTimes(2);
		expect(mockGotPatch).toHaveBeenNthCalledWith(
			1,
			`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
			{ json: { machineAction: 'uploading' } }
		);
		expect(mockGotPatch).toHaveBeenNthCalledWith(
			2,
			`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
			{ json: { machineAction: 'check_fail' } }
		);
		expect(mockGotDelete).toHaveBeenCalledTimes(1);
		expect(mockGotDelete).toHaveBeenCalledWith(`https://test-doc-api-host:3001/document`, {
			json: { documentPath }
		});
		expect(mockClamAvScanStream).toHaveBeenCalledTimes(1);
	});

	describe('if document has already been maked as uploaded in Back Office API', () => {
		test("still sends 'failed' machine action to back office API and deletes blob from blob storage", async () => {
			// GIVEN
			const documentGuid = randomUUID();
			const documentPath = `/application/ABC/${documentGuid}/test.pdf`;

			mockGotPatch
				.mockRejectedValueOnce(backOfficeFailedToMarkAsUploadedError)
				.mockResolvedValueOnce({});
			mockGotDelete.mockResolvedValueOnce({});
			mockClamAvScanStream.mockResolvedValueOnce({ isInfected: true });

			// WHEN
			await checkMyBlob(new Context({ uri: `${blobHostUrl}${documentPath}` }), documentBuffer);

			// THEN
			expect(mockGotPatch).toHaveBeenCalledTimes(2);
			expect(mockGotPatch).toHaveBeenNthCalledWith(
				1,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{
					json: {
						machineAction: 'uploading'
					}
				}
			);
			expect(mockGotPatch).toHaveBeenNthCalledWith(
				2,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{ json: { machineAction: 'check_fail' } }
			);
			expect(mockGotDelete).toHaveBeenCalledTimes(1);
			expect(mockGotDelete).toHaveBeenCalledWith(`https://test-doc-api-host:3001/document`, {
				json: { documentPath }
			});
			expect(mockClamAvScanStream).toHaveBeenCalledTimes(1);
		});
	});

	describe('if document has already been deleted from Blob Storage', () => {
		test("still sends 'failed' machine action to back office API", async () => {
			// GIVEN
			const documentGuid = randomUUID();
			const documentPath = `/application/ABC/${documentGuid}/test.pdf`;

			mockGotPatch.mockResolvedValueOnce({}).mockResolvedValueOnce({});
			mockGotDelete.mockRejectedValueOnce(documentStorageFailedToDeleteError);
			mockClamAvScanStream.mockResolvedValueOnce({ isInfected: true });

			// WHEN
			await checkMyBlob(new Context({ uri: `${blobHostUrl}${documentPath}` }), documentBuffer);

			// THEN
			expect(mockGotPatch).toHaveBeenCalledTimes(2);
			expect(mockGotPatch).toHaveBeenNthCalledWith(
				1,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{
					json: {
						machineAction: 'uploading'
					}
				}
			);
			expect(mockGotPatch).toHaveBeenNthCalledWith(
				2,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{ json: { machineAction: 'check_fail' } }
			);
			expect(mockGotDelete).toHaveBeenCalledTimes(1);
			expect(mockGotDelete).toHaveBeenCalledWith(`https://test-doc-api-host:3001/document`, {
				json: { documentPath }
			});
			expect(mockClamAvScanStream).toHaveBeenCalledTimes(1);
		});
	});

	describe('if document has already been marked as failed in Back Office API', () => {
		test('still deletes blob from blob storage', async () => {
			// GIVEN
			const documentGuid = randomUUID();
			const documentPath = `/application/ABC/${documentGuid}/test.pdf`;

			mockGotPatch
				.mockResolvedValueOnce({})
				.mockRejectedValueOnce(backOfficeFailedToMarkAsFailedAVError);
			mockGotDelete.mockResolvedValueOnce({});
			mockClamAvScanStream.mockResolvedValueOnce({ isInfected: true });

			// WHEN
			await checkMyBlob(new Context({ uri: `${blobHostUrl}${documentPath}` }), documentBuffer);

			// THEN
			expect(mockGotPatch).toHaveBeenCalledTimes(2);
			expect(mockGotPatch).toHaveBeenNthCalledWith(
				1,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{
					json: {
						machineAction: 'uploading'
					}
				}
			);
			expect(mockGotPatch).toHaveBeenNthCalledWith(
				2,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{ json: { machineAction: 'check_fail' } }
			);
			expect(mockGotDelete).toHaveBeenCalledTimes(1);
			expect(mockGotDelete).toHaveBeenCalledWith(`https://test-doc-api-host:3001/document`, {
				json: { documentPath }
			});
			expect(mockClamAvScanStream).toHaveBeenCalledTimes(1);
		});
	});
});
