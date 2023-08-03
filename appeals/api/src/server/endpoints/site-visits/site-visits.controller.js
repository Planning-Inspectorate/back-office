import {
	ERROR_FAILED_TO_SAVE_DATA,
	STATE_TARGET_ISSUE_DETERMINATION
} from '#endpoints/constants.js';
import siteVisitRepository from '#repositories/site-visit.repository.js';
import logger from '#utils/logger.js';
import transitionState from '../../state/transition-state.js';
import { formatSiteVisit } from './site-visits.formatter.js';

/** @typedef {import('express').RequestHandler} RequestHandler */
/** @typedef {import('express').Response} Response */

/**
 * @type {RequestHandler}
 * @returns {Response}
 */
const getSiteVisitById = (req, res) => {
	const { appeal } = req;
	const formattedAppeal = formatSiteVisit(appeal);

	return res.send(formattedAppeal);
};

/**
 * @type {RequestHandler}
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

	try {
		await siteVisitRepository.createSiteVisitById({
			appealId,
			visitDate,
			visitEndTime,
			visitStartTime,
			siteVisitTypeId: visitType.id
		});

		if (visitDate) {
			await transitionState(appealId, appealType, appealStatus, STATE_TARGET_ISSUE_DETERMINATION);
		}

		return res.send(body);
	} catch (error) {
		logger.error(error);
		return res.status(500).send({ errors: { body: ERROR_FAILED_TO_SAVE_DATA } });
	}
};

/**
 * @type {RequestHandler}
 * @returns {Promise<Response>}
 */
const updateSiteVisit = async (req, res) => {
	const {
		appeal: { appealStatus, appealType },
		body,
		body: { visitDate, visitEndTime, visitStartTime },
		params: { appealId, siteVisitId },
		visitType
	} = req;

	try {
		await siteVisitRepository.updateSiteVisitById(Number(siteVisitId), {
			...(visitDate && { visitDate }),
			...(visitEndTime && { visitEndTime }),
			...(visitStartTime && { visitStartTime }),
			...(visitType && { siteVisitTypeId: visitType?.id })
		});

		if (visitType && visitDate) {
			await transitionState(
				Number(appealId),
				appealType,
				appealStatus,
				STATE_TARGET_ISSUE_DETERMINATION
			);
		}

		return res.send(body);
	} catch (error) {
		logger.error(error);
		return res.status(500).send({ errors: { body: ERROR_FAILED_TO_SAVE_DATA } });
	}
};

export { createSiteVisit, getSiteVisitById, updateSiteVisit };
