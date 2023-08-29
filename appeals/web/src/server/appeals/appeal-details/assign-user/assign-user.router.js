import { Router as createRouter } from 'express';
// import config from '@pins/appeals.web/environment/config.js';
// import { assertGroupAccess } from '../../../app/auth/auth.guards.js';
import * as controller from './assign-user.controller.js';

const router = createRouter({ mergeParams: true });

router.route('/case-officer').get(controller.getAssignCaseOfficer);
router.route('/inspector').get(controller.getAssignInspector);

export default router;
