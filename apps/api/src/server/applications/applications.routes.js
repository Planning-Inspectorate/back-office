import express from 'express';
import { caseAdminOfficerRoutes } from './case-admin-officer/case-admin-officer.routes.js';
import { caseOfficerRoutes } from './case-officer/case-officer.routes.js';
import { inspectorRoutes } from './inspector/inspector.routes.js';
import { sectorRoutes } from './sector/sector.routes.js';
import { regionRoutes } from './region/region.routes.js';

const router = new express.Router();

router.use('/case-officer', caseOfficerRoutes);

router.use('/case-admin-officer', caseAdminOfficerRoutes);

router.use('/inspector', inspectorRoutes);

router.use('/region', regionRoutes);

router.use('/sector', sectorRoutes);

export { router as applicationsRoutes };
