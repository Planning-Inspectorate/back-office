import { Router as createRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { trimUnexpectedRequestParameters } from '../../middleware/trim-unexpected-request-parameters.js';
import { getSectors } from './sector.controller.js';
import { validateGetSubSectors } from './sectors.validators.js';

const router = createRouter();

router.get(
	'/',
	/*
		#swagger.tags = ['Applications']
		#swagger.path = '/applications/sector'
		#swagger.description = 'Gets all sectors and sub-sectors'
		#swagger.parameters['obj'] = {
            in: 'query',
            description: 'Sector Name',
            schema: { sectorName: '' }
    	}
        #swagger.responses[200] = {
            description: 'List of sectors or sub-sectors',
            schema: { $ref: '#/definitions/Sectors' }
        }
	 */
	validateGetSubSectors,
	trimUnexpectedRequestParameters,
	asyncHandler(getSectors)
);

export { router as sectorRoutes };
