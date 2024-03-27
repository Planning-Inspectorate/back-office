import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import * as controller from './applications-s51.controller.js';
import * as locals from '../applications-case.locals.js';
import {
	s51ValidatorsDispatcher,
	validateS51AdviceToChange,
	validateS51AdviceActions,
	validateS51AdviceToPublish,
	validateS51UniqueTitle
} from './applications-s51.validators.js';

const applicationsS51Router = createRouter({ mergeParams: true });

applicationsS51Router
	.route('/')
	.get(locals.registerFolder, asyncHandler(controller.viewApplicationsCaseS51Folder));

applicationsS51Router
	.route('/change-status')
	.post(
		[validateS51AdviceToChange, validateS51AdviceActions, locals.registerFolder],
		asyncHandler(controller.updateApplicationsCaseS51ItemStatus)
	);

applicationsS51Router
	.route('/create/check-your-answers')
	.get(asyncHandler(controller.viewApplicationsCaseS51CheckYourAnswers))
	.post(asyncHandler(controller.postApplicationsCaseS51CheckYourAnswersSave));

applicationsS51Router
	.route('/create/:step')
	.get(locals.registerFolder, asyncHandler(controller.viewApplicationsCaseS51CreatePage))
	.post(
		[s51ValidatorsDispatcher, validateS51UniqueTitle],
		asyncHandler(controller.updateApplicationsCaseS51CreatePage)
	);

applicationsS51Router
	.route('/:adviceId/delete')
	.get(locals.registerFolder, asyncHandler(controller.viewApplicationsCaseS51Delete))
	.post(locals.registerFolder, asyncHandler(controller.deleteApplicationsCaseS51));

applicationsS51Router
	.route('/:adviceId/upload')
	.get(locals.registerFolder, asyncHandler(controller.viewApplicationsCaseS51Upload));

applicationsS51Router
	.route('/unpublish/:adviceId')
	.get(locals.registerFolderId, asyncHandler(controller.viewUnpublishAdvice))
	.post(locals.registerFolderId, asyncHandler(controller.postUnpublishAdvice));

applicationsS51Router
	.route('/:adviceId/attachments/:attachmentId/delete')
	.get(asyncHandler(controller.viewApplicationsCaseS51AttachmentDelete))
	.post(locals.registerFolder, asyncHandler(controller.deleteApplicationsCaseS51Attachment));

applicationsS51Router
	.route('/:adviceId/edit/:step')
	.get(locals.registerFolderId, asyncHandler(controller.viewApplicationsCaseEditS51Item))
	.post(asyncHandler(controller.postApplicationsCaseEditS51Item));

applicationsS51Router
	.route('/:adviceId/:step')
	.get(locals.registerFolderId, asyncHandler(controller.viewApplicationsCaseS51Item));

applicationsS51Router
	.route('/publishing-queue')
	.get(locals.registerFolderId, asyncHandler(controller.viewApplicationsCaseS51PublishingQueue))
	.post(
		[validateS51AdviceToPublish, locals.registerFolderId],
		asyncHandler(controller.publishApplicationsCaseS51Items)
	);

applicationsS51Router
	.route('/publishing-queue/remove/:adviceId')
	.get(
		locals.registerFolderId,
		asyncHandler(controller.removeApplicationsCaseS51AdviceFromPublishingQueue)
	);

export default applicationsS51Router;
