import express from 'express';
import { getValidation } from './validation.controller.js';
import { getAppealReview } from './appeal-review/appeal-review.controller.js';

const router = express.Router();
const routerAppeal = express.Router();

router.get('/', getValidation);
routerAppeal.get('/', getAppealReview);

export {
	router as validationRoutes,
	routerAppeal as appealReviewRoutes,
};
