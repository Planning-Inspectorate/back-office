// @ts-nocheck
import { jest } from '@jest/globals';
import { ReadableStream } from 'node:stream/web';

class MockBlockBlobClient {
	constructor(blobPath) {
		this.blobPath = blobPath;
	}

	async download() {
		return new Promise((resolve) => {
			resolve({ readableStreamBody: new ReadableStream() });
		});
	}

	async uploadStream(stream) {
		return new Promise((resolve) => {
			resolve(stream);
		});
	}
}

class MockContainerClient {
	constructor(container) {
		this.container = container;
	}

	getBlockBlobClient(blobPath) {
		return new MockBlockBlobClient(blobPath);
	}
}

class MockBlobServiceClient {
	constructor(connectionString) {
		this.connectionString = connectionString;
	}

	static fromConnectionString(connectionString) {
		return new MockBlobServiceClient(connectionString);
	}

	getContainerClient(container) {
		return new MockContainerClient(container);
	}
}

jest.unstable_mockModule('@azure/storage-blob', () => ({
	default: {
		BlobServiceClient: MockBlobServiceClient
	},
	BlobServiceClient: MockBlobServiceClient
}));
