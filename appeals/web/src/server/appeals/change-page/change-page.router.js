import { Router as createRouter } from 'express';

import * as controller from './change-page.controller.js';

const router = createRouter({ mergeParams: true });

router.route('/:question').get(controller.getChangePage);

export default router;
