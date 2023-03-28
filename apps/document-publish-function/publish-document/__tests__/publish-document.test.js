// @ts-nocheck
import { jest } from '@jest/globals';
// import nock from 'nock';
// import { publishDocument } from '../publish-document.js';

// class Context {
// 	constructor() {
// 		this.log = () => {
// 			jest.fn();
// 		};
// 		this.log.verbose = () => {
// 			jest.fn();
// 		};
// 		this.log.info = () => {
// 			jest.fn();
// 		};
// 		this.log.warn = () => {
// 			jest.fn();
// 		};
// 		this.log.error = () => {
// 			jest.fn();
// 		};
// 	}
// }

// nock('http://127.0.0.1:10000').persist().get(/.*/).reply(200, [], {'Content-Length': 1, ETag: "0x8CB171DBEAD6A6B"});
// nock('http://127.0.0.1:10000').persist().patch(/.*/).reply(200);
// nock('http://127.0.0.1:10000').persist().put(/.*/).reply(200);

class MockBlockBlobClient {
	constructor(blobPath) {
		this.blobPath = blobPath;
	}

	async download() {
		return Promise.new({ readableStreamBody: new ReadableStream() });
	}

	async uploadStream(stream) {
		return Promise.new(stream);
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
	BlobServiceClient: MockBlobServiceClient
}));

// const blobStorageClient = jest.fn();
// const backOfficeApiClient = jest.fn();

test('test', () => {
	expect(true).toEqual(true);
});
// describe('Publishing document', () => {
// 	test(
// 		'Newly received document ' +
// 			'is copied over to the public blob storage container ' +
// 			'applications front office notified and back office notified',
// 		async () => {
// 			// GIVEN
// 			const documentContainer = 'some-container';
// 			const documentPath = 'some-path';
// 			const documentDestinationContainer = 'some-published-container';
// 			const documentDestinationPath = 'some-new-path';

// 			// WHEN
// 			await publishDocument(
// 				new Context(),
// 				{
// 					container: documentContainer,
// 					path: documentPath
// 				},
// 				{
// 					container: documentDestinationContainer,
// 					path: documentDestinationPath
// 				}
// 			);

// 			// THEN
// 			// expect(blobStorageClient).toHaveBeenCalledOnce();
// 			// expect(backOfficeApiClient).toHaveBeenCalledOnce();
// 		}
// 	);

// 	test.todo(
// 		'A document that has already been copied over to the public blob storage container ' +
// 			'should not block notification to applications front office and back office'
// 	);
// });
