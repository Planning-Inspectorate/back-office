import {
	ERROR_FAILED_TO_SAVE_DATA,
	STATE_TARGET_ISSUE_DETERMINATION
} from '#endpoints/constants.js';
import appealRepository from '#repositories/appeal.repository.js';
import logger from '#utils/logger.js';
import transitionState from '../../state/transition-state.js';
import siteVisitFormatter from './site-visit.formatter.js';

/** @typedef {import('express').RequestHandler} RequestHandler */

/**
 * @type {RequestHandler}
 * @returns {object}
 */
const getSiteVisitById = (req, res) => {
	const { appeal } = req;
	const formattedAppeal = siteVisitFormatter.formatSiteVisit(appeal);

	return res.send(formattedAppeal);
};

/**
 * @type {RequestHandler}
 * @returns {Promise<object>}
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
		await appealRepository.createSiteVisitById({
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
 * @returns {Promise<object>}
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
		await appealRepository.updateById(
			Number(siteVisitId),
			{
				...(visitDate && { visitDate }),
				...(visitEndTime && { visitEndTime }),
				...(visitStartTime && { visitStartTime }),
				...(visitType && { siteVisitTypeId: visitType?.id })
			},
			'siteVisit'
		);

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
