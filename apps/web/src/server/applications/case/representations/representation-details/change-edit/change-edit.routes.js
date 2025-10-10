import { Router } from 'express';
import { postChangeEdit } from './change-edit.controller.js';

const router = Router({ mergeParams: true });

router.post('/', postChangeEdit);

export default router;
