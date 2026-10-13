import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import * as controller from './applications-examination-library.controller.js';
import * as sectionController from './applications-examination-library-section.controller.js';
import * as publishController from './applications-examination-library-publish.controller.js';

const applicationsExamLibraryRouter = createRouter({ mergeParams: true });

applicationsExamLibraryRouter.route('/').get(asyncHandler(controller.getExaminationLibraryIndex));
applicationsExamLibraryRouter
	.route('/category/:slug')
	.get(asyncHandler(sectionController.getExaminationLibrarySection));
applicationsExamLibraryRouter
	.route('/category/:slug/publish')
	.get(asyncHandler(publishController.getExaminationLibraryPublish))
	.post(asyncHandler(publishController.postExaminationLibraryPublish));

export default applicationsExamLibraryRouter;
