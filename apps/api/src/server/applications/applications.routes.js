import express from 'express';
import { caseOfficerRoutes } from './case-officer/case-officer.routes.js';

const router = new express.Router();

router.use(
    '/case-officer',
    caseOfficerRoutes
)

export { router as applicationsRoutes }
