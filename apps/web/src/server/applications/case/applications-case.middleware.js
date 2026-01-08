import { viewApplicationsCaseOverview } from './applications-case.controller.js';
import { SUB_SECTORS } from '../common/constants.js';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function checkProjectTypeBeforePublish(req, res, next) {
	const isGeneratingStations = res.locals.case?.subSector?.name === SUB_SECTORS.GENERATING_STATIONS;
	const hasProjectType = !!res.locals.case?.additionalDetails?.subProjectType;

	if (isGeneratingStations && !hasProjectType) {
		/** @type {import('@pins/express').ValidationErrors} */
		req.errors = {
			subProjectType: {
				location: 'body',
				param: 'subProjectType',
				value: req.body?.subProjectType ?? '',
				msg: 'Choose the project type'
			}
		};
		return viewApplicationsCaseOverview(req, res);
	}
	next();
}
