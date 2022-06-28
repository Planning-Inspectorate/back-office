import { Router as createRouter } from 'express';
import * as controller from './applications-create-new.controller.js';
import * as guards from './applications-create-new.guards.js';

const createNewRouter = createRouter();

createNewRouter.use(guards.assertDomainTypeIsNotInspector);
createNewRouter.route('/').get(controller.createNewCase);

export default createNewRouter;
