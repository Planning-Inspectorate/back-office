import express from 'express';

const router = express.Router();

// GET /health-check - Check service health
router.route('/health-check').get((request, response) => {
	response.send('OK');
});

export default router;
