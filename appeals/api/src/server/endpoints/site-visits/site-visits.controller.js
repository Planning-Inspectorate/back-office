import { createAuditTrail } from '#endpoints/audit-trails/audit-trails.service.js';
import {
	AUDIT_TRAIL_SITE_VISIT_ARRANGED,
	AUDIT_TRAIL_SITE_VISIT_TYPE_SELECTED,
	DEFAULT_DATE_FORMAT_AUDIT_TRAIL,
	ERROR_FAILED_TO_SAVE_DATA,
	STATE_TARGET_ISSUE_DETERMINATION
} from '#endpoints/constants.js';
import siteVisitRepository from '#repositories/site-visit.repository.js';
import logger from '#utils/logger.js';
import stringTokenReplacement from '#utils/string-token-replacement.js';
import { format, parseISO } from 'date-fns';
import transitionState from '../../state/transition-state.js';
import { formatSiteVisit } from './site-visits.formatter.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Response}
 */
const getSiteVisitById = (req, res) => {
	const { appeal } = req;
	const formattedAppeal = formatSiteVisit(appeal);

	return res.send(formattedAppeal);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
const createSiteVisit = async (req, res) => {
	const {
		appeal: { appealStatus, appealType },
		body,
		body: { visitDate, visitEndTime, visitStartTime },
		params,
		visitType
	} = req;
	const appealId = Number(params.appealId);
	const azureAdUserId = String(req.get('azureAdUserId'));

	try {
		await siteVisitRepository.createSiteVisitById({
			appealId,
			visitDate,
			visitEndTime,
			visitStartTime,
			siteVisitTypeId: visitType.id
		});

		if (visitDate) {
			await transitionState(
				appealId,
				appealType,
				azureAdUserId,
				appealStatus,
				STATE_TARGET_ISSUE_DETERMINATION
			);

			await createAuditTrail({
				appealId,
				azureAdUserId,
				details: stringTokenReplacement(AUDIT_TRAIL_SITE_VISIT_ARRANGED, [
					format(parseISO(visitDate), DEFAULT_DATE_FORMAT_AUDIT_TRAIL)
				])
			});
		}

		return res.send(body);
	} catch (error) {
		logger.error(error);
		return res.status(500).send({ errors: { body: ERROR_FAILED_TO_SAVE_DATA } });
	}
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
const updateSiteVisit = async (req, res) => {
	const {
		appeal: { appealStatus, appealType },
		body,
		body: { visitDate, visitEndTime, visitStartTime },
		params,
		params: { siteVisitId },
		visitType
	} = req;
	const appealId = Number(params.appealId);
	const azureAdUserId = String(req.get('azureAdUserId'));

	try {
		await siteVisitRepository.updateSiteVisitById(Number(siteVisitId), {
			...(visitDate && { visitDate }),
			...(visitEndTime && { visitEndTime }),
			...(visitStartTime && { visitStartTime }),
			...(visitType && { siteVisitTypeId: visitType?.id })
		});

		if (visitType && visitDate) {
			await transitionState(
				appealId,
				appealType,
				azureAdUserId,
				appealStatus,
				STATE_TARGET_ISSUE_DETERMINATION
			);
		}

		if (visitType) {
			createAuditTrail({
				appealId,
				azureAdUserId,
				details: AUDIT_TRAIL_SITE_VISIT_TYPE_SELECTED
			});
		}

		return res.send(body);
	} catch (error) {
		logger.error(error);
		return res.status(500).send({ errors: { body: ERROR_FAILED_TO_SAVE_DATA } });
	}
};

export { createSiteVisit, getSiteVisitById, updateSiteVisit };
