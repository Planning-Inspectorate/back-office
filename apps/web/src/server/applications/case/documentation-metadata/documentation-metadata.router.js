import { Router as createRouter } from 'express';
import { asyncHandler } from '@pins/express';
import * as controller from './documentation-metadata.controller.js';
import * as locals from './documentation-metadata.locals.js';
import * as validators from './documentation-metadata.validators.js';
import { registerDocumentGuid } from '../applications-case.locals.js';

const applicationsDocumentationMetadataRouter = createRouter({ mergeParams: true });

applicationsDocumentationMetadataRouter.use([
	locals.registerUrlParameters,
	locals.registerDocumentMetaData
]);

applicationsDocumentationMetadataRouter
	.route('/:metaDataName')
	.get(asyncHandler(controller.viewDocumentationMetaData))
	.post(
		[validators.validatorsDispatcher, registerDocumentGuid],
		asyncHandler(controller.updateDocumentationMetaData)
	);

export default applicationsDocumentationMetadataRouter;
