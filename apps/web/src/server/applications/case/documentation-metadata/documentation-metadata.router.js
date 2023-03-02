import { Router as createRouter } from 'express';
import asyncRoute from '../../../lib/async-route.js';
import { assertDomainTypeIsNotInspector } from '../../create-new-case/applications-create.guards.js';
import * as controller from './documentation-metadata.controller.js';
import * as locals from './documentation-metadata.locals.js';
import * as validators from './documentation-metadata.validators.js';

const applicationsDocumentationMetadataRouter = createRouter({ mergeParams: true });

applicationsDocumentationMetadataRouter.use(assertDomainTypeIsNotInspector);
applicationsDocumentationMetadataRouter.use([
	locals.registerUrlParameters,
	locals.registerDocumentMetaData
]);

applicationsDocumentationMetadataRouter
	.route('/:metaDataName')
	.get(asyncRoute(controller.viewDocumentationMetaData))
	.post(validators.validatorsDispatcher, asyncRoute(controller.updateDocumentationMetaData));

export default applicationsDocumentationMetadataRouter;
