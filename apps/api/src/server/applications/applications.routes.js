import express from 'express';
import { caseAdminOfficerRoutes } from './case-admin-officer/case-admin-officer.routes.js';
import { caseOfficerRoutes } from './case-officer/case-officer.routes.js';
import { inspectorRoutes } from './inspector/inspector.routes.js';

const router = new express.Router();

router.use('/case-officer', caseOfficerRoutes);

router.use('/case-admin-officer', caseAdminOfficerRoutes);

router.use('/inspector', inspectorRoutes);

export { router as applicationsRoutes };
