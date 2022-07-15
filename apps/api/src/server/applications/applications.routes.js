import express from 'express';
import { applicationRoutes } from './application/application.routes.js';
import { caseAdminOfficerRoutes } from './case-admin-officer/case-admin-officer.routes.js';
import { caseOfficerRoutes } from './case-officer/case-officer.routes.js';
import { inspectorRoutes } from './inspector/inspector.routes.js';
import { regionRoutes } from './region/region.routes.js';
import { caseSearchRoutes } from './search/case-search.routes.js';
import { sectorRoutes } from './sector/sector.routes.js';
import { zoomLevelRoutes } from './zoom-level/zoom-level.routes.js';

const router = new express.Router();

router.use('/case-officer', caseOfficerRoutes);

router.use('/case-admin-officer', caseAdminOfficerRoutes);

router.use('/inspector', inspectorRoutes);

router.use('/region', regionRoutes);

router.use('/sector', sectorRoutes);

router.use('/search', caseSearchRoutes);

router.use('/zoom-level', zoomLevelRoutes);

router.use('/', applicationRoutes);

export { router as applicationsRoutes };
