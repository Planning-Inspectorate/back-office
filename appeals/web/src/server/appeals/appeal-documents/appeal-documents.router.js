import { Router as createRouter } from 'express';
import * as controller from './appeal-documents.controller.js';

const router = createRouter({ mergeParams: true });

//router.route('/').get(controller.listFolders);
//router.route('/:folderId/').get(controller.listFiles);
router.route('/:folderId/upload/:documentId?').get(controller.upload);
//router.route('/:fileId/download').get(controller.download);

export default router;
