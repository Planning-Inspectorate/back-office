import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import * as controller from './applications-examination-library.controller.js';
import * as sectionController from './applications-examination-library-section.controller.js';

const applicationsExamLibraryRouter = createRouter({ mergeParams: true });

applicationsExamLibraryRouter.route('/').get(asyncHandler(controller.getExaminationLibraryIndex));
applicationsExamLibraryRouter
	.route('/:slug')
	.get(asyncHandler(sectionController.getExaminationLibrarySection));

export default applicationsExamLibraryRouter;
