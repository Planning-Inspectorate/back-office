import { Router as createRouter } from 'express';
import { getExaminationLibraryPOC } from './examinaiton-library-poc.controller.js';

const applicationsExamLibraryRouter = createRouter({ mergeParams: true });

applicationsExamLibraryRouter.route('/doc-ref-poc').get(getExaminationLibraryPOC);

export default applicationsExamLibraryRouter;
