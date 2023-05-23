import { Router as createRouter } from 'express';
import enterStartDateRouter from '../enter-start-date/enter-start-date.router.js';
import startDateEnteredRouter from '../start-date-entered/start-date-entered.router.js';
import * as controller from './appeal-details.controller.js';

const router = createRouter();

router.route('/:appealId').get(controller.viewAppealDetails);

router.use('/:appealId/enter-start-date', enterStartDateRouter);
router.use('/:appealId/start-date-entered', startDateEnteredRouter);

export default router;
