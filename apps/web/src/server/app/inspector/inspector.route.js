import express from 'express';
import { viewAppealDetails } from './inspector.controller.js';

const router = express.Router();

router.route('/:appealId').get(viewAppealDetails);

export default router;
