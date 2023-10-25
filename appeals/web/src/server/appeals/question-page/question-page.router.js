import { Router as createRouter } from 'express';

import * as controller from './question-page.controller.js';

const router = createRouter({ mergeParams: true });

router.route('/:question').get(controller.getQuestionPage);

export default router;
