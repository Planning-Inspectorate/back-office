import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import {
	getExaminationLibraryCategoriesHandler,
	createExaminationLibraryCategoriesHandler,
	getExaminationLibraryDocumentsHandler
} from './examination-library.controller.js';

import {
	validateApplicationId,
	validateGetCategories,
	validateCreateCategories,
	validateGetDocuments
} from './examination-library.validators.js';

const router = createRouter({ mergeParams: true });

router.get(
	'/',
	validateApplicationId,
	validateGetCategories,
	asyncHandler(getExaminationLibraryCategoriesHandler)
);
router.post(
	'/',
	validateApplicationId,
	validateCreateCategories,
	asyncHandler(createExaminationLibraryCategoriesHandler)
);
router.get(
	'/documents',
	validateApplicationId,
	validateGetDocuments,
	asyncHandler(getExaminationLibraryDocumentsHandler)
);

export { router as examinationLibraryRouter };
