import { Router as createRouter } from 'express';
import * as controller from './appeal-documents.controller.js';

const router = createRouter({ mergeParams: true });

router.route('/:folderId/upload').get(controller.upload);
router.route('/:fileId/download').get(controller.download);

export default router;
