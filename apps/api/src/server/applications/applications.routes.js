import express from 'express';
import { caseOfficerRoutes } from './case-officer/case-officer.routes.js';
import { caseOfficerAdminRoutes } from './case-officer-admin/case-officer-admin.routes.js';
import { inspectorRoutes } from './inspector/inspector.routes.js';

const router = new express.Router();

router.use('/case-officer', caseOfficerRoutes);

router.use('/case-officer-admin', caseOfficerAdminRoutes);

router.use('/inspector', inspectorRoutes);

export { router as applicationsRoutes };
