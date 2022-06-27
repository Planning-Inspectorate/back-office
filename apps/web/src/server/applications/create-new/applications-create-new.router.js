import { Router as createRouter } from 'express';
import * as controller from './applications-create-new.controller.js';

const createNewRouter = createRouter();

createNewRouter.route('/').get(controller.createNewCase);

export default createNewRouter;
