// @ts-nocheck
import supertest from 'supertest';
import { createTestEnvironment } from '../../../../../../../testing/index.js';
import { representationsUrl } from '../../config.js';
import { unpublishRepresentationsErrorRouter } from '../unpublish-representations-error.router.js';
import { unpublishRepresentationsErrorUrl } from '../../config.js';

const { app, installMockApi, teardown } = createTestEnvironment();
const request = supertest(app);
const errorRoute = `/${unpublishRepresentationsErrorUrl}`;
const serviceUrl = '/applications-service';
const caseId = '42';

describe('unpublish-representations-error (integration)', () => {
	beforeEach(() => {
		installMockApi();
		app.use((req, res, next) => {
			res.locals.serviceUrl = serviceUrl;
			res.locals.caseId = caseId;
			next();
		});
		app.use('/case/:caseId', unpublishRepresentationsErrorRouter);
	});

	afterEach(() => {
		teardown();
	});

	it('should render the error view with correct backlink (integration)', async () => {
		const response = await request.get(`/case/${caseId}${errorRoute}`);
		const expectedBackLink = `${serviceUrl}/case/${caseId}/${representationsUrl}`;
		expect(response.text).toContain(expectedBackLink);
		expect(response.status).toBe(200);
	});
});
