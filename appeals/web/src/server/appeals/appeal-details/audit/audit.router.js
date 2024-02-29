import { Router as createRouter } from 'express';
import asyncRoute from '#lib/async-route.js';
import { renderAudit } from './audit.controller.js';

const auditRouter = createRouter({ mergeParams: true });

auditRouter.route('/').get(asyncRoute(renderAudit));

export { auditRouter };
