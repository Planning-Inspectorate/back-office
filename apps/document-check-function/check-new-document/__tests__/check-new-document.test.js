// @ts-nocheck
import { jest } from '@jest/globals';
import { HTTPError } from 'got';
import { randomUUID } from 'node:crypto';

jest.unstable_mockModule('got', () => ({
	default: {
		patch: jest.fn(),
		delete: jest.fn()
	},
	HTTPError
}));

jest.unstable_mockModule('../clam-av-client.js', () => ({
	clamAvClient: {
		scanStream: jest.fn()
	}
}));

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
const { checkMyBlob } = await import('../check-my-blob.js');
const { default: got } = await import('got');
const { clamAvClient } = await import('../clam-av-client.js');

beforeEach(() => {
	jest.clearAllMocks();
});

describe('document passes AV checks', () => {
	test("sends 'passed' machine action to back office API", async () => {
		// GIVEN
		const documentGuid = randomUUID();

		got.patch.mockResolvedValueOnce({}).mockResolvedValueOnce({});
		clamAvClient.scanStream.mockResolvedValueOnce({ isInfected: false });

		// WHEN
		await checkMyBlob(
			new Context({ uri: `${blobHostUrl}/application/ABC/${documentGuid}/test.pdf` }),
			documentBuffer
		);

		// THEN
		expect(got.patch).toHaveBeenCalledTimes(2);
		expect(got.patch).toHaveBeenNthCalledWith(
			1,
			`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
			{ json: { machineAction: 'uploading' } }
		);
		expect(got.patch).toHaveBeenNthCalledWith(
			2,
			`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
			{ json: { machineAction: 'check_success' } }
		);
		expect(clamAvClient.scanStream).toHaveBeenCalledTimes(1);
	});

	describe('if document has already been marked as uploaded in Back Office API', () => {
		test("still sends 'passed' machine action to back office API", async () => {
			// GIVEN
			const documentGuid = randomUUID();

			got.patch
				.mockRejectedValueOnce(backOfficeFailedToMarkAsUploadedError)
				.mockResolvedValueOnce({});
			clamAvClient.scanStream.mockResolvedValueOnce({ isInfected: false });

			// WHEN
			await checkMyBlob(
				new Context({ uri: `${blobHostUrl}/application/ABC/${documentGuid}/test.pdf` }),
				documentBuffer
			);

			// THEN
			expect(got.patch).toHaveBeenCalledTimes(2);
			expect(got.patch).toHaveBeenNthCalledWith(
				1,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{ json: { machineAction: 'uploading' } }
			);
			expect(got.patch).toHaveBeenNthCalledWith(
				2,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{ json: { machineAction: 'check_success' } }
			);
			expect(clamAvClient.scanStream).toHaveBeenCalledTimes(1);
		});
	});

	describe('if document has already been marked as passed AV checks', () => {
		test('completes without issues', async () => {
			const documentGuid = randomUUID();

			got.patch
				.mockResolvedValueOnce({})
				.mockRejectedValueOnce(backOfficeFailedToMarkAsPassedAVError);
			clamAvClient.scanStream.mockResolvedValueOnce({ isInfected: false });

			// WHEN
			await checkMyBlob(
				new Context({ uri: `${blobHostUrl}/application/ABC/${documentGuid}/test.pdf` }),
				documentBuffer
			);

			// THEN
			expect(got.patch).toHaveBeenCalledTimes(2);
			expect(got.patch).toHaveBeenNthCalledWith(
				1,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{ json: { machineAction: 'uploading' } }
			);
			expect(got.patch).toHaveBeenNthCalledWith(
				2,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{ json: { machineAction: 'check_success' } }
			);
			expect(clamAvClient.scanStream).toHaveBeenCalledTimes(1);
		});
	});
});

describe('document fails AV checks', () => {
	test("sends 'failed' machine action to back office API and deleted blob from blob storage", async () => {
		// GIVEN
		const documentGuid = randomUUID();
		const documentPath = `/application/ABC/${documentGuid}/test.pdf`;

		got.patch.mockResolvedValueOnce({}).mockResolvedValueOnce({});
		got.delete.mockResolvedValueOnce({});
		clamAvClient.scanStream.mockResolvedValueOnce({ isInfected: true });

		// WHEN
		await checkMyBlob(new Context({ uri: `${blobHostUrl}${documentPath}` }), documentBuffer);

		// THEN
		expect(got.patch).toHaveBeenCalledTimes(2);
		expect(got.patch).toHaveBeenNthCalledWith(
			1,
			`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
			{ json: { machineAction: 'uploading' } }
		);
		expect(got.patch).toHaveBeenNthCalledWith(
			2,
			`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
			{ json: { machineAction: 'check_fail' } }
		);
		expect(got.delete).toHaveBeenCalledTimes(1);
		expect(got.delete).toHaveBeenCalledWith(`https://test-doc-api-host:3001/document`, {
			json: { documentPath }
		});
		expect(clamAvClient.scanStream).toHaveBeenCalledTimes(1);
	});

	describe('if document has already been maked as uploaded in Back Office API', () => {
		test("still sends 'failed' machine action to back office API and deletes blob from blob storage", async () => {
			// GIVEN
			const documentGuid = randomUUID();
			const documentPath = `/application/ABC/${documentGuid}/test.pdf`;

			got.patch
				.mockRejectedValueOnce(backOfficeFailedToMarkAsUploadedError)
				.mockResolvedValueOnce({});
			got.delete.mockResolvedValueOnce({});
			clamAvClient.scanStream.mockResolvedValueOnce({ isInfected: true });

			// WHEN
			await checkMyBlob(new Context({ uri: `${blobHostUrl}${documentPath}` }), documentBuffer);

			// THEN
			expect(got.patch).toHaveBeenCalledTimes(2);
			expect(got.patch).toHaveBeenNthCalledWith(
				1,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{
					json: {
						machineAction: 'uploading'
					}
				}
			);
			expect(got.patch).toHaveBeenNthCalledWith(
				2,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{ json: { machineAction: 'check_fail' } }
			);
			expect(got.delete).toHaveBeenCalledTimes(1);
			expect(got.delete).toHaveBeenCalledWith(`https://test-doc-api-host:3001/document`, {
				json: { documentPath }
			});
			expect(clamAvClient.scanStream).toHaveBeenCalledTimes(1);
		});
	});

	describe('if document has already been deleted from Blob Storage', () => {
		test("still sends 'failed' machine action to back office API", async () => {
			// GIVEN
			const documentGuid = randomUUID();
			const documentPath = `/application/ABC/${documentGuid}/test.pdf`;

			got.patch.mockResolvedValueOnce({}).mockResolvedValueOnce({});
			got.delete.mockRejectedValueOnce(documentStorageFailedToDeleteError);
			clamAvClient.scanStream.mockResolvedValueOnce({ isInfected: true });

			// WHEN
			await checkMyBlob(new Context({ uri: `${blobHostUrl}${documentPath}` }), documentBuffer);

			// THEN
			expect(got.patch).toHaveBeenCalledTimes(2);
			expect(got.patch).toHaveBeenNthCalledWith(
				1,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{
					json: {
						machineAction: 'uploading'
					}
				}
			);
			expect(got.patch).toHaveBeenNthCalledWith(
				2,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{ json: { machineAction: 'check_fail' } }
			);
			expect(got.delete).toHaveBeenCalledTimes(1);
			expect(got.delete).toHaveBeenCalledWith(`https://test-doc-api-host:3001/document`, {
				json: { documentPath }
			});
			expect(clamAvClient.scanStream).toHaveBeenCalledTimes(1);
		});
	});

	describe('if document has already been marked as failed in Back Office API', () => {
		test('still deletes blob from blob storage', async () => {
			// GIVEN
			const documentGuid = randomUUID();
			const documentPath = `/application/ABC/${documentGuid}/test.pdf`;

			got.patch
				.mockResolvedValueOnce({})
				.mockRejectedValueOnce(backOfficeFailedToMarkAsFailedAVError);
			got.delete.mockResolvedValueOnce({});
			clamAvClient.scanStream.mockResolvedValueOnce({ isInfected: true });

			// WHEN
			await checkMyBlob(new Context({ uri: `${blobHostUrl}${documentPath}` }), documentBuffer);

			// THEN
			expect(got.patch).toHaveBeenCalledTimes(2);
			expect(got.patch).toHaveBeenNthCalledWith(
				1,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{
					json: {
						machineAction: 'uploading'
					}
				}
			);
			expect(got.patch).toHaveBeenNthCalledWith(
				2,
				`https://test-api-host:3000/applications/documents/${documentGuid}/status`,
				{ json: { machineAction: 'check_fail' } }
			);
			expect(got.delete).toHaveBeenCalledTimes(1);
			expect(got.delete).toHaveBeenCalledWith(`https://test-doc-api-host:3001/document`, {
				json: { documentPath }
			});
			expect(clamAvClient.scanStream).toHaveBeenCalledTimes(1);
		});
	});
});
