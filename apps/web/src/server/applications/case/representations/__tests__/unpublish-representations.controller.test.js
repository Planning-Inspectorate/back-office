import nock from 'nock';
import * as controller from '../unpublish-representations.controller.js';
import { RELEVANT_REPRESENTATION_STATUS_MAP } from '../../../../../../../api/src/server/utils/mapping/map-relevant-representation-status.js';

// Helper to mock modules and re-import controller
async function loadControllerWithMocks(serviceMocks = {}, utilMocks = {}, controllerMocks = {}) {
	jest.doMock('../applications-relevant-reps.service.js', () => serviceMocks);
	jest.doMock('../utils/publish-representations.js', () => utilMocks);
	jest.doMock('../unpublish-representations.controller.js', () => controllerMocks);
	return await import('../unpublish-representations.controller.js');
}

describe('unpublish-representations.controller', () => {
	afterEach(() => {
		nock.cleanAll();
		jest.resetModules();
		jest.clearAllMocks();
	});

	describe('redirectToRelevantReps', () => {
		const makeRes = () => ({ redirect: jest.fn() });
		it('redirects to the relevant representations page with the correct query string', () => {
			const res = makeRes();
			// @ts-ignore: mock res object for plain JS test
			controller.redirectToRelevantReps(res, 123, 5);
			expect(res.redirect).toHaveBeenCalledWith(
				'/applications-service/case/123/relevant-representations?unpublished=5'
			);
		});
		it('redirects with 0 unpublished if not provided', () => {
			const res = makeRes();
			// @ts-ignore: mock res object for plain JS test
			controller.redirectToRelevantReps(res, 456, 0);
			expect(res.redirect).toHaveBeenCalledWith(
				'/applications-service/case/456/relevant-representations?unpublished=0'
			);
		});
	});

	describe('renderUnpublishError', () => {
		it('renders the error page with the correct message and error', () => {
			const res = { status: jest.fn().mockReturnThis(), render: jest.fn() };
			const error = new Error('fail');
			// @ts-ignore: mock res object for plain JS test
			controller.renderUnpublishError(res, error);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(res.render).toHaveBeenCalledWith(
				'error',
				expect.objectContaining({
					message: expect.stringContaining('Failed to unpublish representations'),
					error
				})
			);
		});
	});

	describe('getUnpublishRepresentationsController', () => {
		it('renders the unpublish page with correct data', async () => {
			const mockGetCase = jest.fn().mockResolvedValue({ title: 'Project X' });
			const mockGetRepresentations = jest.fn().mockResolvedValue({
				items: [{ id: 1, status: RELEVANT_REPRESENTATION_STATUS_MAP.PUBLISHED }]
			});
			const mockGetPublishedRepIdsAndCount = jest.fn().mockReturnValue({ publishedRepsCount: 1 });
			const mockRender = jest.fn();
			const { getUnpublishRepresentationsController } = await loadControllerWithMocks(
				{ getCase: mockGetCase, getRepresentations: mockGetRepresentations },
				{ getPublishedRepIdsAndCount: mockGetPublishedRepIdsAndCount }
			);
			const req = {};
			const res = { locals: { caseId: 99 }, render: mockRender };
			// @ts-ignore: mock req/res objects for plain JS test
			await getUnpublishRepresentationsController(req, res);
			expect(mockGetCase).toHaveBeenCalledWith(99);
			expect(mockGetRepresentations).toHaveBeenCalledWith(99, '');
			expect(mockRender).toHaveBeenCalledWith(
				'applications/representations/unpublish-representations.njk',
				expect.objectContaining({
					caseId: 99,
					publishedRepsCount: 1,
					projectName: 'Project X'
				})
			);
		});
	});

	describe('postUnpublishRepresentationsController', () => {
		it('unpublishes and redirects on success', async () => {
			const publishedReps = [{ id: 1, status: RELEVANT_REPRESENTATION_STATUS_MAP.PUBLISHED }];
			const mocks = {
				getRepresentations: jest.fn().mockResolvedValue({ items: publishedReps })
			};
			const utilMocks = {
				getPublishedRepIdsAndCount: jest.fn().mockReturnValue({ publishedRepIds: [1] })
			};
			const controllerMocks = {
				getPublishedReps: jest.fn().mockReturnValue(publishedReps),
				setRepresentationsAsUnpublishedBatch: jest.fn().mockResolvedValue(undefined)
			};
			const mockRedirect = jest.fn();
			const { postUnpublishRepresentationsController } = await loadControllerWithMocks(
				mocks,
				utilMocks,
				controllerMocks
			);
			const req = {
				session: { user: { name: 'testuser' } },
				cookies: {},
				get: () => {},
				header: () => {}
			};
			const res = { locals: { caseId: 77 }, redirect: mockRedirect };
			// @ts-ignore: mock req object for plain JS test
			await postUnpublishRepresentationsController(req, res);
			expect(mocks.getRepresentations).toHaveBeenCalledWith(77, '');
			expect(utilMocks.getPublishedRepIdsAndCount).toHaveBeenCalled();
			expect(controllerMocks.setRepresentationsAsUnpublishedBatch).toHaveBeenCalledWith(
				publishedReps,
				'testuser'
			);
			expect(mockRedirect).toHaveBeenCalledWith(
				'/applications-service/case/77/relevant-representations?unpublished=1'
			);
		});

		it('redirects immediately if no published reps', async () => {
			const mocks = {
				getRepresentations: jest.fn().mockResolvedValue({ items: [] })
			};
			const utilMocks = {
				getPublishedRepIdsAndCount: jest.fn().mockReturnValue({ publishedRepIds: [] })
			};
			const controllerMocks = {
				getPublishedReps: jest.fn().mockReturnValue([])
			};
			const mockRedirect = jest.fn();
			const { postUnpublishRepresentationsController } = await loadControllerWithMocks(
				mocks,
				utilMocks,
				controllerMocks
			);
			const req = { session: {}, cookies: {}, get: () => {}, header: () => {} };
			const res = { locals: { caseId: 88 }, redirect: mockRedirect };
			// @ts-ignore: mock req object for plain JS test
			await postUnpublishRepresentationsController(req, res);
			expect(mockRedirect).toHaveBeenCalledWith(
				'/applications-service/case/88/relevant-representations?unpublished=undefined'
			);
		});

		it('renders error on failure', async () => {
			const publishedReps = [{ id: 1, status: RELEVANT_REPRESENTATION_STATUS_MAP.PUBLISHED }];
			const mocks = {
				getRepresentations: jest.fn().mockResolvedValue({ items: publishedReps })
			};
			const utilMocks = {
				getPublishedRepIdsAndCount: jest.fn().mockReturnValue({ publishedRepIds: [1] })
			};
			const controllerMocks = {
				getPublishedReps: jest.fn().mockReturnValue(publishedReps),
				setRepresentationsAsUnpublishedBatch: jest.fn().mockRejectedValue(new Error('fail')),
				renderUnpublishError: controller.renderUnpublishError
			};
			const mockRender = jest.fn();
			const { postUnpublishRepresentationsController } = await loadControllerWithMocks(
				mocks,
				utilMocks,
				controllerMocks
			);
			const req = {
				session: { user: { name: 'testuser' } },
				cookies: {},
				get: () => {},
				header: () => {}
			};
			const res = { locals: { caseId: 99 }, render: mockRender, redirect: jest.fn() };
			// @ts-ignore: mock req object for plain JS test
			await postUnpublishRepresentationsController(req, res);
			expect(mockRender).toHaveBeenCalledWith(
				'error',
				expect.objectContaining({
					message: expect.stringContaining('Failed to unpublish representations'),
					error: expect.any(Error)
				})
			);
		});
	});
});
