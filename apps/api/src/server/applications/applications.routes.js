import { Router as createRouter } from 'express';
import { asyncHandler } from '../middleware/async-handler.js';
import { trimUnexpectedRequestParameters } from '../middleware/trim-unexpected-request-parameters.js';
import { applicationRoutes } from './application/application.routes.js';
import { documentRoutes } from './application/documents/document.routes.js';
import { fileFoldersRoutes } from './application/file-folders/folders.routes.js';
import { projectUpdateRoutes } from './application/project-updates/project-updates.routes.js';
import { caseAdminOfficerRoutes } from './case-admin-officer/case-admin-officer.routes.js';
import { caseTeamRoutes } from './case-team/case-team.routes.js';
import { updateDocumentStatus } from './documents/documents.controller.js';
import { validateDocumentGUID, validateMachineAction } from './documents/documents.validators.js';
import { examinationTimetableItemRoutes } from './examination-timetable-items/examination-timetable-items.routes.js';
import { examinationTimetableTypeRoutes } from './examination-timetable-type/examination-timetable-type.routes.js';
import { inspectorRoutes } from './inspector/inspector.routes.js';
import { regionRoutes } from './region/region.routes.js';
import { caseSearchRoutes } from './search/case-search.routes.js';
import { sectorRoutes } from './sector/sector.routes.js';
import { zoomLevelRoutes } from './zoom-level/zoom-level.routes.js';
import { subscriptionRoutes } from './subscriptions/subscriptions.routes.js';
import { s51AdviceRoutes } from './s51advice/s51-advice.routes.js';
import { projectUpdateNotificationLogsRoutes } from './application/project-updates/notification-logs/notification-logs.routes.js';

const router = createRouter();

router.use((req, res, next) => {
	console.log('apps router', req.path);
	next();
});

router.use('/case-team', caseTeamRoutes);

router.use('/case-admin-officer', caseAdminOfficerRoutes);

router.use('/inspector', inspectorRoutes);

router.use('/search', caseSearchRoutes);

// reference data
router.use('/region', regionRoutes);
router.use('/sector', sectorRoutes);
router.use('/zoom-level', zoomLevelRoutes);
router.use('/examination-timetable-type', examinationTimetableTypeRoutes);
router.use('/examination-timetable-items', examinationTimetableItemRoutes);
router.use('/', s51AdviceRoutes);

router.use('/subscriptions', subscriptionRoutes);

router.use('/', documentRoutes);

router.use('/', fileFoldersRoutes);

router.use('/', projectUpdateRoutes);
// this would've been nested in the projectUpdateRoutes, but supertest didn't like that and would hang
// even though the express app itself worked fine - the inner router would get unrelated requests, and they
// wouldn't fallthrough to subsequent routers for handling/matching
router.use('/', projectUpdateNotificationLogsRoutes);

router.use('/', applicationRoutes);

router.patch(
	'/documents/:documentGUID/status',
	/*
        #swagger.tags = ['Applications']
        #swagger.path =  '/applications/documents/{documentGUID}/status'
        #swagger.description = 'Updates document status from state machine'
        #swagger.parameters['documentGUID'] = {
            in: 'path',
            description: 'Document GUID',
			required: true,
			type: 'string'
        }
		#swagger.parameters['body'] = {
            in: 'body',
            description: 'Machine Action',
            schema: { machineAction: 'awaiting_virus_check' }
        }
        #swagger.responses[200] = {
            description: 'Document status updated',
            schema: { caseId: 1, guid: 'a1b2c4d4-7ce5-410c-937e-28926dd7ab24', status: 'awaiting_virus_check'}
        }
	 */
	validateDocumentGUID,
	validateMachineAction,
	trimUnexpectedRequestParameters,
	asyncHandler(updateDocumentStatus)
);

export { router as applicationsRoutes };
