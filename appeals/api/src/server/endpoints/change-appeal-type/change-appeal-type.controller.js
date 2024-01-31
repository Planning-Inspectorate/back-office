import { databaseConnector } from '#utils/database-connector.js';
import timetableRepository from '#repositories/appeal-timetable.repository.js';
import {
	STATE_TARGET_AWAITING_TRANSFER,
	STATE_TARGET_CLOSED,
	STATE_TARGET_TRANSFERRED
} from '#endpoints/constants.js';
import transitionState from '#state/transition-state.js';
import { broadcastAppealState } from '#endpoints/integrations/integrations.service.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const getAppealTypes = async (req, res) => {
	const allAppealTypes = req.appealTypes;
	const response = allAppealTypes.filter(
		(appealType) => appealType.shorthand !== req.appeal.appealType?.shorthand
	);
	return res.send(response);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const requestChangeOfAppealType = async (req, res) => {
	const appeal = req.appeal;
	const { azureUserId } = req.params;
	const { newAppealTypeId, newAppealTypeFinalDate } = req.body;

	Promise.all([
		await databaseConnector.appeal.update({
			where: { id: appeal.id },
			data: {
				resubmitTypeId: newAppealTypeId,
				updatedAt: new Date()
			}
		}),
		await timetableRepository.upsertAppealTimetableById(appeal.id, {
			resubmitAppealTypeDate: new Date(newAppealTypeFinalDate)
		}),
		await transitionState(
			appeal.id,
			appeal.appealType,
			azureUserId,
			appeal.appealStatus,
			STATE_TARGET_CLOSED
		),
		await broadcastAppealState(appeal.id)
	]);

	return res.send(true);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const requestTransferOfAppeal = async (req, res) => {
	const appeal = req.appeal;
	const { azureUserId } = req.params;
	const { newAppealTypeId } = req.body;

	Promise.all([
		await databaseConnector.appeal.update({
			where: { id: appeal.id },
			data: {
				resubmitTypeId: newAppealTypeId,
				updatedAt: new Date()
			}
		}),
		await transitionState(
			appeal.id,
			appeal.appealType,
			azureUserId,
			appeal.appealStatus,
			STATE_TARGET_AWAITING_TRANSFER
		),
		await broadcastAppealState(appeal.id)
	]);

	return res.send(true);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
export const requestConfirmationTransferOfAppeal = async (req, res) => {
	const appeal = req.appeal;
	const { azureUserId } = req.params;
	const { newAppealReference } = req.body;

	Promise.all([
		await databaseConnector.appeal.update({
			where: { id: appeal.id },
			data: {
				transferredCaseId: newAppealReference,
				updatedAt: new Date()
			}
		}),
		await transitionState(
			appeal.id,
			appeal.appealType,
			azureUserId,
			appeal.appealStatus,
			STATE_TARGET_TRANSFERRED
		),
		await broadcastAppealState(appeal.id)
	]);

	return res.send(true);
};
