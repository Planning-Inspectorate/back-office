import { Router as createRouter } from 'express';
import * as controller from './example.controller.js';

const router = createRouter();

// GetAll
router.route('/').get(controller.viewAllExamples);

// GetById

router.route('/:id').get(controller.viewExampleById);

// Create

router.route('/').post(controller.setExample);

// UpdateById

router.route('/:id').patch(controller.updateExampleById);
