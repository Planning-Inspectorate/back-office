import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import * as controller from './applications-relevant-reps.controller.js';
import { publishUpdatedRepresentationsRouter } from './publish-updated-representations/publish-updated-representations.router.js';
import { publishRepresentationsErrorRouter } from './publish-representations-error/publish-representations-error.router.js';
import relevantRepContactDetailsRouter from './representation/contact-details/contact-details.router.js';
import relevantRepAddressDetailsRouter from './representation/address-details/address-details.router.js';
import relevantRepresentationTypeRouter from './representation/representation-type/representation-type.router.js';
import relevantRepContactMethodRouter from './representation/contact-method/contact-method.router.js';
import relevantRepresentationUnder18Router from './representation/under-18/under-18.router.js';
import relevantRepEntityRouter from './representation/representation-entity/entity.router.js';
import relevantRepresentationCommentRouter from './representation/representation-comment/representation-comment.router.js';
import relevantRepresentationAttachmentUploadRouter from './representation/attachment-upload/attachment-upload.router.js';
import representationDetailsRouter from './representation-details/application-representation-details.router.js';
import publishValidRepresentationsRouter from './publish-valid-representations/publish-valid-reps.router.js';
import { fileUploadController } from './file-upload/file-upload.controller.js';
import { repRoutes } from './representation/utils/get-representation-page-urls.js';
import { getRepDownloadController } from './download/download.controller.js';

const relevantRepsRouter = createRouter({ mergeParams: true });

relevantRepsRouter.route('/').get(asyncRoute(controller.relevantRepsApplications));
relevantRepsRouter.use('/', relevantRepContactDetailsRouter);
relevantRepsRouter.use('/', relevantRepAddressDetailsRouter);
relevantRepsRouter.use('/', relevantRepresentationTypeRouter);
relevantRepsRouter.use('/', relevantRepContactMethodRouter);
relevantRepsRouter.use('/', relevantRepresentationUnder18Router);
relevantRepsRouter.use('/', relevantRepEntityRouter);
relevantRepsRouter.use('/', relevantRepresentationCommentRouter);
relevantRepsRouter.use('/', relevantRepresentationAttachmentUploadRouter);
relevantRepsRouter.use(
	`/:representationId${repRoutes.representationDetails}`,
	representationDetailsRouter
);
relevantRepsRouter.use('/', publishValidRepresentationsRouter);
relevantRepsRouter.use('/', publishUpdatedRepresentationsRouter);
relevantRepsRouter.use('/', publishRepresentationsErrorRouter);

relevantRepsRouter.route('/:repId/api/upload').post(fileUploadController);

relevantRepsRouter.route('/api/download').get(getRepDownloadController);

export default relevantRepsRouter;
