const { databaseConnector } = await import('../../../../utils/database-connector.js');

import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { app } from '../../../../app.js';
import config from '../../../../config/config.js';
import { applicationStates } from '../../../state-machine/application.machine.js';

const request = supertest(app);

describe('delete Document', () => {
	beforeEach(() => {
		jest.clearAllMocks();

		// @ts-ignore
		jest.replaceProperty(config, 'clientCredentialsGrantEnabled', false);
	});

	test('The test case involves deleting a document setting its "isDeleted" property to "true".', async () => {
		// GIVEN
		databaseConnector.document.findFirst.mockResolvedValue({
			guid: '1111-2222-3333',
			name: 'my_doc.doc',
			folderId: 1,
			blobStorageContainer: 'document-service-uploads',
			blobStoragePath: '/application/BC010001/1111-2222-3333/my_doc.doc',
			status: applicationStates.draft,
			createdAt: '2022-12-12 17:12:25.9610000',
			redacted: true
		});

		const isDeleted = true;

		// WHEN
		const response = await request.post('/applications/1/documents/1111-2222-3333/delete').send({});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({ isDeleted });
		expect(databaseConnector.document.findFirst).toHaveBeenCalledWith({
			where: {
				guid: '1111-2222-3333',
				isDeleted: false,
				folder: {
					caseId: 1
				}
			}
		});

		expect(databaseConnector.document.delete).toHaveBeenCalledWith({
			where: {
				guid: '1111-2222-3333'
			}
		});
	});

	test('The test case involves deleting a document setting its "isDeleted" property to "true". when enabling clientCredentialsGrantEnabled', async () => {
		// GIVEN

		// @ts-ignore
		jest.replaceProperty(config, 'clientCredentialsGrantEnabled', true);

		jwt.decode.mockResolvedValue({
			header: {
				typ: 'JWT',
				alg: 'RS256',
				x5t: '-KI3Q9nNR7bRofxmeZoXqbHZGew',
				kid: '-KI3Q9nNR7bRofxmeZoXqbHZGew'
			},
			payload: {
				aud: 'api://12333',
				iss: 'https://sts.windows.net/b3327b60-a205-45a0-ae22-63da4de3a27a/',
				aio: 'E2ZgYOhkMI5UnnrGKjQ9bgubrmgaAA==',
				appid: '509806cf-a03d-42cc-b85d-a221e1d62617',
				appidacr: '1',
				roles: ['read'],
				sub: '85bd6743-ac2e-424b-bd59-7658a5b102c7'
			},
			signature:
				'fhu8uis6653CCNR3nbuhOH3e3G3VvszfalkqQ2iSYrT3J50FhOnMacEdEHfOXhds_i7OKx_I7uHpQMUe9sYs_XpOc7tY73lIDeR2Tvg1r5db4Osxi2gUUPFv0D0x7bdi3wlWGO7yyw0xlvF0d5w6UVAloSBMv2Nl9psmTYsFmpdeEGoN6acOyub8DDk4kWfKlioJAiCeRoAIXa5sfrt61LIqpaGxXhvYfgAfZgVMe3PN2DY9bmp8h-mZUQnLTWrRxqYuz9vesMVbyaXvga7oWA_fiqC9ctvZ0Lnt5Xbomu1Zw9-hkTTc1UvbzQl8aey_PciQ1N2SLqQ8u6Zthxde2A'
		});

		jwt.verify.mockResolvedValue({
			aud: 'api://7815c73e-1f32-4f4b-8a9e-dc6f8126681e',
			iss: 'https://sts.windows.net/b3327b60-a205-45a0-ae22-63da4de3a27a/',
			aio: 'E2ZgYOhkMI5UnnrGKjQ9bgubrmgaAA==',
			appid: '509806cf-a03d-42cc-b85d-a221e1d62617',
			appidacr: '1',
			idp: 'https://sts.windows.net/b3327b60-a205-45a0-ae22-63da4de3a27a/',
			oid: '85bd6743-ac2e-424b-bd59-7658a5b102c7',
			rh: '0.AUsAYHsyswWioEWuImPaTeOiej7HFXgyH0tPip7cb4EmaB5LAAA.',
			roles: ['read'],
			sub: '85bd6743-ac2e-424b-bd59-7658a5b102c7',
			tid: 'b3327b60-a205-45a0-ae22-63da4de3a27a',
			uti: 'S9ytKWq4L0iJf6zc1Gl_Ag',
			ver: '1.0'
		});

		databaseConnector.document.findFirst.mockResolvedValue({
			guid: '1111-2222-3333',
			name: 'my_doc.doc',
			folderId: 1,
			blobStorageContainer: 'document-service-uploads',
			blobStoragePath: '/application/BC010001/1111-2222-3333/my_doc.doc',
			status: applicationStates.draft,
			createdAt: '2022-12-12 17:12:25.9610000',
			redacted: true
		});

		const isDeleted = true;

		// WHEN
		const response = await request
			.post('/applications/1/documents/1111-2222-3333/delete')
			.send({})
			.set({
				authorization: 'Bearer accessToken'
			});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({ isDeleted });
		expect(databaseConnector.document.findFirst).toHaveBeenCalledWith({
			where: {
				guid: '1111-2222-3333',
				isDeleted: false,
				folder: {
					caseId: 1
				}
			}
		});

		expect(databaseConnector.document.delete).toHaveBeenCalledWith({
			where: {
				guid: '1111-2222-3333'
			}
		});
	});

	test('should fail to delete document because document is published', async () => {
		// GIVEN
		databaseConnector.document.findFirst.mockResolvedValue({
			guid: '1111-2222-3333',
			name: 'my_doc.doc',
			folderId: 1,
			blobStorageContainer: 'document-service-uploads',
			blobStoragePath: '/application/BC010001/1111-2222-3333/my_doc.doc',
			status: applicationStates.published,
			createdAt: '2022-12-12 17:12:25.9610000',
			redacted: true
		});

		// WHEN
		const response = await request.post('/applications/1/documents/1111-2222-3333/delete').send({});

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: 'unable to delete document guid 1111-2222-3333 related to casedId 1'
		});
	});

	test('should fail to delete document when enabling clientCredentialsGrantEnabled and the accessToken is not in the header', async () => {
		// GIVEN

		// @ts-ignore
		jest.replaceProperty(config, 'clientCredentialsGrantEnabled', true);

		// WHEN
		const response = await request
			.post('/applications/1/documents/1111-2222-3333/delete')
			.send({})
			.set({
				authorization: 'Bearer'
			});

		// THEN
		expect(response.status).toEqual(401);
		expect(response.body).toEqual({
			errors: [{ message: 'You have no access! Please try again later.' }]
		});
	});

	test('should fail if document is not found', async () => {
		// GIVEN
		databaseConnector.document.findFirst.mockResolvedValue(null);

		// WHEN
		const response = await request.post('/applications/1/documents/1111-2222-3333/delete').send({});

		// THEN
		expect(response.status).toEqual(404);

		expect(response.body).toEqual({
			errors: 'document not found guid 1111-2222-3333 related to casedId 1'
		});
	});
});
