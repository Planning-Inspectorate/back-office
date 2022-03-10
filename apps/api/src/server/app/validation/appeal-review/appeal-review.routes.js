import express from 'express';
import { getAppealReview } from './appeal-review.controller.js';

const router = express.Router();

router.get('/', getAppealReview);

export {
	router as appealReviewRoutes
};
