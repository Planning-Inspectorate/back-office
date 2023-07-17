import nock from 'nock';
import supertest from 'supertest';
import { parseHtml } from '@pins/platform';
import { createTestEnvironment } from '@pins/appeals.web/testing/index.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const validAppealId = 1;
const invalidAppealId = 2;
const validFolderId = 1;
const invalidFolderId = 2;
const documentId = '0e4ce48f-2d67-4659-9082-e80a15182386';
const validFolders = [{ id: validFolderId, path: '/' }];

const getControllerEndpoint = (
	/** @type {number} */ appealId,
	/** @type {number} */ folderId,
	/** @type {string|undefined} */ documentId
) => {
	let baseUrl = `/appeals-service/appeal-details/${appealId}/documents/${folderId}/upload`;
	if (documentId) {
		baseUrl += `/${documentId}`;
	}
	return baseUrl;
};

describe('documents upload', () => {
	beforeEach(installMockApi);
	afterEach(teardown);

	it('should return 404 if appeal ID is not found', async () => {
		nock('http://test/').get(`/appeals/${invalidAppealId}`).reply(404);
		nock('http://test/').get(`/appeals/${invalidAppealId}/document-location/1`).reply(404);

		const response = await request.get(getControllerEndpoint(invalidAppealId, invalidFolderId));
		expect(response.statusCode).toBe(404);
	});

	it('should return 404 if folder ID is not found', async () => {
		nock('http://test/').get(`/appeals/${validAppealId}`).reply(200, { id: validAppealId });
		nock('http://test/')
			.get(`/appeals/${validAppealId}/document-location/1`)
			.reply(200, validFolders);

		const response = await request.get(getControllerEndpoint(validAppealId, invalidFolderId));
		expect(response.status).toBe(404);
	});

	it('should return 404 if document ID is not found', async () => {
		nock('http://test/').get(`/appeals/${validAppealId}`).reply(200, { id: validAppealId });
		nock('http://test/')
			.get(`/appeals/${validAppealId}/document-location/1`)
			.reply(200, validFolders);
		nock('http://test/').get(`/appeals/${invalidAppealId}/documents/${documentId}`).reply(404);

		const response = await request.get(
			getControllerEndpoint(validAppealId, validFolderId, documentId)
		);
		expect(response.status).toBe(404);
	});

	it('should render upload form if appeal ID and folder ID are found', async () => {
		nock('http://test/').get(`/appeals/${validAppealId}`).reply(200, { id: validAppealId });
		nock('http://test/')
			.get(`/appeals/${validAppealId}/document-location/1`)
			.reply(200, validFolders);

		const response = await request.get(getControllerEndpoint(validAppealId, validFolderId));
		expect(response.status).toBe(200);

		const html = parseHtml(response.text);
		expect(html.innerHTML).toMatchSnapshot();
	});

	it('should render upload form if appeal ID, folder ID and document ID are found', async () => {
		nock('http://test/').get(`/appeals/${validAppealId}`).reply(200, { id: validAppealId });
		nock('http://test/')
			.get(`/appeals/${validAppealId}/document-location/1`)
			.reply(200, validFolders);
		nock('http://test/')
			.get(`/appeals/${validAppealId}/documents/${documentId}`)
			.reply(200, { latestDocumentVersion: {} });

		const response = await request.get(
			getControllerEndpoint(validAppealId, validFolderId, documentId)
		);
		expect(response.status).toBe(200);

		const html = parseHtml(response.text);
		expect(html.innerHTML).toMatchSnapshot();
	});

	it('should render appeal ID and folder ID as data attributes', async () => {
		nock('http://test/').get(`/appeals/${validAppealId}`).reply(200, { id: validAppealId });
		nock('http://test/')
			.get(`/appeals/${validAppealId}/document-location/1`)
			.reply(200, validFolders);

		const response = await request.get(getControllerEndpoint(validAppealId, validFolderId));
		const html = parseHtml(response.text);

		const dataAttributes = processAttrs(html.querySelector('.pins-file-upload')?.attributes);
		// @ts-ignore
		expect(dataAttributes['data-case-id']).toEqual(validAppealId.toString());
		// @ts-ignore
		expect(dataAttributes['data-folder-id']).toEqual(validFolderId.toString());
		// @ts-ignore
		expect(dataAttributes['data-document-id']).toBeUndefined();
		// @ts-ignore
		expect(html.querySelector('#upload-file-1')?.attributes['multiple']).not.toBeUndefined();
	});

	it('should render appeal ID, folder ID and document ID as data attributes', async () => {
		nock('http://test/').get(`/appeals/${validAppealId}`).reply(200, { id: validAppealId });
		nock('http://test/')
			.get(`/appeals/${validAppealId}/document-location/1`)
			.reply(200, validFolders);
		nock('http://test/')
			.get(`/appeals/${validAppealId}/documents/${documentId}`)
			.reply(200, { latestDocumentVersion: {} });

		const response = await request.get(
			getControllerEndpoint(validAppealId, validFolderId, documentId)
		);
		const html = parseHtml(response.text);

		const dataAttributes = processAttrs(html.querySelector('.pins-file-upload')?.attributes);
		// @ts-ignore
		expect(dataAttributes['data-case-id']).toEqual(validAppealId.toString());
		// @ts-ignore
		expect(dataAttributes['data-folder-id']).toEqual(validFolderId.toString());
		// @ts-ignore
		expect(dataAttributes['data-document-id']).toEqual(documentId);
		// @ts-ignore
		expect(html.querySelector('#upload-file-1')?.attributes['multiple']).toBeUndefined();
	});

	it('should render blob host and container', async () => {
		nock('http://test/').get(`/appeals/${validAppealId}`).reply(200, { id: validAppealId });
		nock('http://test/')
			.get(`/appeals/${validAppealId}/document-location/1`)
			.reply(200, validFolders);

		const response = await request.get(getControllerEndpoint(validAppealId, validFolderId));
		const html = parseHtml(response.text);

		const dataAttributes = processAttrs(html.querySelector('.pins-file-upload')?.attributes);
		// @ts-ignore
		expect(dataAttributes['data-blob-storage-host']).not.toBe(null);
		// @ts-ignore
		expect(dataAttributes['data-blob-storage-container']).not.toBe(null);
	});
});

const processAttrs = (/** @type {NamedNodeMap | undefined} */ attrs) => {
	const items = {};
	if (attrs) {
		for (const item of Object.keys(attrs)) {
			if (item.indexOf('data') === 0) {
				// @ts-ignore
				items[item] = attrs[item];
			}
		}
	}

	return items;
};
