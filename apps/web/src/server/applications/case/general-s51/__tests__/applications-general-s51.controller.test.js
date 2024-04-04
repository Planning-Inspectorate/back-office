// @ts-nocheck
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../testing/index.js';
import {
	generalSection51CaseReference,
	generalSection51FolderName
} from '../applications-general-s51.config.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

const nocks = () => {
	nock('http://test/')
		.persist()
		.get(`/applications/reference/${generalSection51CaseReference}`)
		.reply(200, { id: 111111111, reference: generalSection51CaseReference });

	nock('http://test/')
		.persist()
		.get(`/applications/111111111/folders`)
		.reply(200, [{ id: 222222222, displayNameEn: generalSection51FolderName }]);

	nock('http://test/')
		.persist()
		.get(`/applications-service/case/111111111/project-documentation/222222222/s51-advice`)
		.reply(200, {});
};

describe('General section 51 page', () => {
	beforeEach(installMockApi);

	afterEach(() => {
		nock.cleanAll();
		teardown();
	});

	describe('#viewGeneralSection51page', () => {
		beforeEach(async () => {
			nocks();
		});

		it('should redirect directly to general section 51 folder', async () => {
			const response = await request.get(`/applications-service/general-section-51`);

			expect(response.status).toEqual(302);
			expect(response.header.location).toEqual(
				'/applications-service/case/111111111/project-documentation/222222222/s51-advice'
			);
		});
	});
});
