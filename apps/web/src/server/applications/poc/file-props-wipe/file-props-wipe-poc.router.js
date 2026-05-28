import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import * as controller from './file-props-wipe-poc.controller.js';

const router = createRouter();

// GET  /                → form to collect caseId + folderId
// POST /                → validate inputs, redirect to /file-upload
router
	.route('/')
	.get(asyncHandler(controller.viewMainPage))
	.post(asyncHandler(controller.handleMainForm));

// GET  /file-upload     → file uploader page (requires caseId + folderId in query)
// POST /file-upload     → handle delete-and-retry action
router
	.route('/file-upload')
	.get(asyncHandler(controller.viewFileUpload))
	.post(asyncHandler(controller.deleteAndRetry));

// GET  /result          → fetch document properties and show Phase 2 wipe evidence
router.get('/result', asyncHandler(controller.showResult));

export default router;
