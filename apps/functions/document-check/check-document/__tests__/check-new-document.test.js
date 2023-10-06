// @ts-nocheck
import { jest } from '@jest/globals';
import got, { HTTPError } from 'got';
import { randomUUID } from 'node:crypto';
import { Readable } from 'node:stream';
import { checkMyBlob } from '../check-my-blob.js';
import { clamAvClient } from '../clam-av-client.js';
import { BlobStorageClient } from '@pins/blob-storage-client';

const mockGotPatch = jest.spyOn(got, 'patch');
const mockClamAvScanStream = jest.spyOn(clamAvClient, 'scanStream');
const mockDeleteBlockIfExists = jest.fn().mockResolvedValue();
jest.spyOn(BlobStorageClient, 'fromUrlAndCredential').mockReturnValue({
	deleteBlobIfExists: mockDeleteBlockIfExists
});

// Mock Errors

const mock200Response = { json: jest.fn().mockResolvedValue({}) };

const generateHttpError = (body, statusCode) => {
	const response = { body, statusCode };
	const error = new HTTPError(response);

	error.response = response;

	return { json: jest.fn().mockRejectedValue(error) };
};

const backOfficeFailedToMarkAsUploadedError = generateHttpError('{}', 409);

const backOfficeFailedToMarkAsPassedAVError = generateHttpError(
	'{"errors":{"application":"Could not transition \'not_checked\' using \'not_checked\'."}}',
	409
);

const backOfficeFailedToMarkAsFailedAVError = generateHttpError(
	'{"errors":{"application":"Could not transition \'failed_virus_check\' using \'failed_virus_check\'."}}',
	409
);

// End Mock Errors

const stream = Readable.from([]);

const logger = {
	info: jest.fn(),
	error: jest.fn()
};
const blobHost = 'https://test.blob.core.windows.net';
const blobContainer = 'container';
const blobHostUrl = `${blobHost}/${blobContainer}`;

beforeEach(() => {
	jest.clearAllMocks();
});

describe('document passes AV checks', () => {
	test("sends 'passed' machine action to back office API", async () => {
		// GIVEN
		const documentGuid = randomUUID();

		mockGotPatch.mockReturnValueOnce(mock200Response).mockReturnValueOnce(mock200Response);
		mockClamAvScanStream.mockResolvedValueOnce({ isInfected: false });

		// WHEN
		await checkMyBlob(logger, `${blobHostUrl}/application/ABC/${documentGuid}/1`, stream);

		// THEN
		expect(mockGotPatch).toHaveBeenCalledTimes(2);
		expect(mockGotPatch).toHaveBeenNthCalledWith(
			1,
			`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
			{ json: { machineAction: 'awaiting_virus_check' } }
		);
		expect(mockGotPatch).toHaveBeenNthCalledWith(
			2,
			`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
			{ json: { machineAction: 'not_checked' } }
		);
		expect(mockClamAvScanStream).toHaveBeenCalledTimes(1);
	});

	describe('if document has already been marked as uploaded in Back Office API', () => {
		test("still sends 'passed' machine action to back office API", async () => {
			// GIVEN
			const documentGuid = randomUUID();

			mockGotPatch
				.mockReturnValueOnce(backOfficeFailedToMarkAsUploadedError)
				.mockReturnValueOnce(mock200Response);
			mockClamAvScanStream.mockResolvedValueOnce({ isInfected: false });

			// WHEN
			await checkMyBlob(logger, `${blobHostUrl}/application/ABC/${documentGuid}/1`, stream);

			// THEN
			expect(mockGotPatch).toHaveBeenCalledTimes(2);
			expect(mockGotPatch).toHaveBeenNthCalledWith(
				1,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{ json: { machineAction: 'awaiting_virus_check' } }
			);
			expect(mockGotPatch).toHaveBeenNthCalledWith(
				2,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{ json: { machineAction: 'not_checked' } }
			);
			expect(mockClamAvScanStream).toHaveBeenCalledTimes(1);
		});
	});

	describe('if document has already been marked as passed AV checks', () => {
		test('completes without issues', async () => {
			// GIVEN
			const documentGuid = randomUUID();

			mockGotPatch
				.mockReturnValueOnce(mock200Response)
				.mockReturnValueOnce(backOfficeFailedToMarkAsPassedAVError);
			mockClamAvScanStream.mockResolvedValueOnce({ isInfected: false });

			// WHEN
			await checkMyBlob(logger, `${blobHostUrl}/application/ABC/${documentGuid}/1`, stream);

			// THEN
			expect(mockGotPatch).toHaveBeenCalledTimes(2);
			expect(mockGotPatch).toHaveBeenNthCalledWith(
				1,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{ json: { machineAction: 'awaiting_virus_check' } }
			);
			expect(mockGotPatch).toHaveBeenNthCalledWith(
				2,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{ json: { machineAction: 'not_checked' } }
			);
			expect(mockClamAvScanStream).toHaveBeenCalledTimes(1);
		});
	});
});

describe('document fails AV checks', () => {
	test("sends 'failed' machine action to back office API and deleted blob from blob storage", async () => {
		// GIVEN
		const documentGuid = randomUUID();
		const documentPath = `/application/ABC/${documentGuid}/1`;

		mockGotPatch.mockReturnValueOnce(mock200Response).mockReturnValueOnce(mock200Response);
		mockClamAvScanStream.mockResolvedValueOnce({ isInfected: true });

		// WHEN
		await checkMyBlob(logger, `${blobHostUrl}${documentPath}`, stream);

		// THEN
		expect(mockGotPatch).toHaveBeenCalledTimes(2);
		expect(mockGotPatch).toHaveBeenNthCalledWith(
			1,
			`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
			{ json: { machineAction: 'awaiting_virus_check' } }
		);
		expect(mockGotPatch).toHaveBeenNthCalledWith(
			2,
			`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
			{ json: { machineAction: 'failed_virus_check' } }
		);
		expect(mockDeleteBlockIfExists).toHaveBeenCalledTimes(1);
		expect(mockDeleteBlockIfExists).toHaveBeenCalledWith(blobContainer, documentPath.substring(1));
		expect(mockClamAvScanStream).toHaveBeenCalledTimes(1);
	});

	describe('if document has already been maked as uploaded in Back Office API', () => {
		test("still sends 'failed' machine action to back office API and deletes blob from blob storage", async () => {
			// GIVEN
			const documentGuid = randomUUID();
			const documentPath = `/application/ABC/${documentGuid}/1`;

			mockGotPatch
				.mockReturnValueOnce(backOfficeFailedToMarkAsUploadedError)
				.mockReturnValueOnce(mock200Response);
			mockClamAvScanStream.mockResolvedValueOnce({ isInfected: true });

			// WHEN
			await checkMyBlob(logger, `${blobHostUrl}${documentPath}`, stream);

			// THEN
			expect(mockGotPatch).toHaveBeenCalledTimes(2);
			expect(mockGotPatch).toHaveBeenNthCalledWith(
				1,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{
					json: {
						machineAction: 'awaiting_virus_check'
					}
				}
			);
			expect(mockGotPatch).toHaveBeenNthCalledWith(
				2,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{ json: { machineAction: 'failed_virus_check' } }
			);
			expect(mockDeleteBlockIfExists).toHaveBeenCalledTimes(1);
			expect(mockDeleteBlockIfExists).toHaveBeenCalledWith(
				blobContainer,
				documentPath.substring(1)
			);
			expect(mockClamAvScanStream).toHaveBeenCalledTimes(1);
		});
	});

	describe('if document has already been deleted from Blob Storage', () => {
		test("still sends 'failed' machine action to back office API", async () => {
			// GIVEN
			const documentGuid = randomUUID();
			const documentPath = `/application/ABC/${documentGuid}/1`;

			mockGotPatch.mockReturnValueOnce(mock200Response).mockReturnValueOnce(mock200Response);
			mockClamAvScanStream.mockResolvedValueOnce({ isInfected: true });

			// WHEN
			await checkMyBlob(logger, `${blobHostUrl}${documentPath}`, stream);

			// THEN
			expect(mockGotPatch).toHaveBeenCalledTimes(2);
			expect(mockGotPatch).toHaveBeenNthCalledWith(
				1,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{
					json: {
						machineAction: 'awaiting_virus_check'
					}
				}
			);
			expect(mockGotPatch).toHaveBeenNthCalledWith(
				2,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{ json: { machineAction: 'failed_virus_check' } }
			);
			expect(mockDeleteBlockIfExists).toHaveBeenCalledTimes(1);
			expect(mockDeleteBlockIfExists).toHaveBeenCalledWith(
				blobContainer,
				documentPath.substring(1)
			);
			expect(mockClamAvScanStream).toHaveBeenCalledTimes(1);
		});
	});

	describe('if document has already been marked as failed in Back Office API', () => {
		test('still deletes blob from blob storage', async () => {
			// GIVEN
			const documentGuid = randomUUID();
			const documentPath = `/application/ABC/${documentGuid}/1`;

			mockGotPatch
				.mockReturnValueOnce(mock200Response)
				.mockReturnValueOnce(backOfficeFailedToMarkAsFailedAVError);
			mockClamAvScanStream.mockResolvedValueOnce({ isInfected: true });

			// WHEN
			await checkMyBlob(logger, `${blobHostUrl}${documentPath}`, stream);

			// THEN
			expect(mockGotPatch).toHaveBeenCalledTimes(2);
			expect(mockGotPatch).toHaveBeenNthCalledWith(
				1,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{
					json: {
						machineAction: 'awaiting_virus_check'
					}
				}
			);
			expect(mockGotPatch).toHaveBeenNthCalledWith(
				2,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{ json: { machineAction: 'failed_virus_check' } }
			);
			expect(mockDeleteBlockIfExists).toHaveBeenCalledTimes(1);
			expect(mockDeleteBlockIfExists).toHaveBeenCalledWith(
				blobContainer,
				documentPath.substring(1)
			);
			expect(mockClamAvScanStream).toHaveBeenCalledTimes(1);
		});
	});
});
