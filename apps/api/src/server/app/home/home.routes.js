import express from 'express';
import { getHome } from './home.controller.js';

const router = express.Router();

router.get('/', getHome);

export {
	router as homeRoutes
};
