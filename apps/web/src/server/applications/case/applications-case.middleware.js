import { SUB_SECTORS } from '../common/constants.js';
import { setSessionProjectTypeError } from '../common/services/session.service.js';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function checkProjectTypeBeforePublish(req, res, next) {
	const isGeneratingStations = res.locals.case?.subSector?.name === SUB_SECTORS.GENERATING_STATIONS;
	const hasProjectType = !!res.locals.case?.additionalDetails?.subProjectType;

	if (isGeneratingStations && !hasProjectType) {
		setSessionProjectTypeError(req.session, {
			subProjectType: {
				location: 'body',
				param: 'subProjectType',
				value: req.body?.subProjectType ?? '',
				msg: 'Choose the project type'
			}
		});
		return res.redirect(`/applications-service/case/${req.params.caseId}/overview`);
	}
	next();
}
