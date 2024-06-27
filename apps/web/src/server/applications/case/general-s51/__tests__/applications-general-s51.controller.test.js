// @ts-nocheck
import nock from 'nock';
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../testing/index.js';
import { BO_GENERAL_S51_CASE_REF, GENERAL_S51_FOLDER_NAME } from '@pins/applications';
import { parseHtml } from '@pins/platform';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);

import { fixturePaginatedS51Advice } from '../../../../../../testing/applications/fixtures/s51-advice.js';
import { createCase } from '../../../../../../testing/applications/factory/application.js';

const fixtureGs51Case = createCase({
	id: 1,
	modifiedDate: `${new Date(2022, 0, 1).getTime() / 1000}`,
	reference: 'GS5110001',
	sector: {
		name: 'general',
		abbreviation: 'GS51',
		displayNameEn: 'General',
		displayNameCy: 'General'
	},
	subSector: {
		name: 'general',
		abbreviation: 'GS51',
		displayNameEn: 'General',
		displayNameCy: 'General'
	},
	status: 'pre-applications',
	caseEmail: 'mock@email.com'
});

const fixtureS51Folder = {
	id: 21,
	displayNameEn: 'S51 advice',
	displayOrder: 100,
	parentFolderId: 1,
	caseId: 123
};

// this mocks the return from getting parent path on folder id 21
const fixtureDocumentationFolderPath = [
	{ id: 1, displayNameEn: 'Project management', parentFolderId: null, caseId: 111111111 },
	{ id: 222222222, displayNameEn: 'Sub folder level 2', parentFolderId: 1, caseId: 111111111 }
];

const nocks = () => {
	nock('http://test/')
		.persist()
		.get(`/applications/reference/${BO_GENERAL_S51_CASE_REF}`)
		.reply(200, { id: 111111111, reference: BO_GENERAL_S51_CASE_REF });

	nock('http://test/')
		.persist()
		.get(`/applications/111111111/folders`)
		.reply(200, [{ id: 222222222, displayNameEn: GENERAL_S51_FOLDER_NAME }]);

	nock('http://test/')
		.persist()
		.get(`/applications-service/case/111111111/project-documentation/222222222/s51-advice`)
		.reply(200, {});

	nock('http://test/').get('/applications').reply(200, []);

	nock('http://test/').get('/applications/111111111').times(2).reply(200, fixtureGs51Case);
	nock('http://test/')
		.get('/applications/111111111/folders/222222222')
		.times(2)
		.reply(200, fixtureS51Folder);
	nock('http://test/')
		.post('/applications/111111111/s51-advice')
		.reply(200, fixturePaginatedS51Advice(1, 50));

	nock('http://test/')
		.get('/applications/111111111/folders/222222222/parent-folders')
		.times(2)
		.reply(200, fixtureDocumentationFolderPath);
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

		it('should render the general section 51 version of the section 51 page', async () => {
			const response = await request.get(
				`/applications-service/case/111111111/project-documentation/222222222/s51-advice`
			);

			const element = parseHtml(response.text, { rootElement: '#main-content' });

			expect(response.status).toEqual(200);
			expect(element.innerHTML).toContain('General S51 advice');
			expect(element.innerHTML).toMatchSnapshot();
		});
	});
});
