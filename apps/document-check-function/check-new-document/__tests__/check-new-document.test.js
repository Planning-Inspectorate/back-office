import { jest } from '@jest/globals';
import { HTTPError } from 'got';

jest.unstable_mockModule('got', () => ({
	default: {
		patch: jest.fn()
	},
	HTTPError
}));

jest.unstable_mockModule('../clam-av-client.js', () => ({
	clamAvClient: {
		scanStream: jest.fn()
	}
}));

class Context {
	/**
	 * @param {{uri: string}} bindingData
	 */
	constructor(bindingData) {
		this.bindingData = bindingData;
		this.log = () => {
			jest.fn();
		};
		// @ts-ignore
		this.log.verbose = () => {
			jest.fn();
		};
		// @ts-ignore
		this.log.info = () => {
			jest.fn();
		};
		// @ts-ignore
		this.log.warn = () => {
			jest.fn();
		};
		// @ts-ignore
		this.log.error = () => {
			jest.fn();
		};
	}
}

const blobHostUrl = 'https://blobhost/container';
const { checkMyBlob } = await import('../check-my-blob.js');
const { default: got } = await import('got');
const { clamAvClient } = await import('../clam-av-client.js');

test('checks blob', async () => {
	// GIVEN
	const documentGuid = '123-345';
	const documentBuffer = Buffer.alloc(0);

	// @ts-ignore
	got.patch.mockResolvedValueOnce({}).mockResolvedValueOnce({});
	// @ts-ignore
	clamAvClient.scanStream.mockResolvedValueOnce({ isInfected: false });

	// WHEN
	// @ts-ignore
	await checkMyBlob(
		new Context({ uri: `${blobHostUrl}/application/ABC/${documentGuid}/test.pdf` }),
		documentBuffer
	);

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
		{
			json: {
				machineAction: 'check_success'
			}
		}
	);
	expect(clamAvClient.scanStream).toHaveBeenCalledTimes(1);
});
