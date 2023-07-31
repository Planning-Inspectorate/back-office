import { Router as createRouter } from 'express';
import nationalListRouter from '../appeals/national-list/national-list.router.js';
import appealDetailsRouter from './appeal-details/appeal-details.router.js';

const router = createRouter();

router.use('/appeals-list', nationalListRouter);

router.use('/appeal-details', appealDetailsRouter);

export default router;
