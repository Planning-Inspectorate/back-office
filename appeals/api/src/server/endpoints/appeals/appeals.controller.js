import { createAuditTrail } from '#endpoints/audit-trails/audit-trails.service.js';
import { getFoldersForAppeal } from '#endpoints/documents/documents.service.js';
import appealRepository from '#repositories/appeal.repository.js';
import { getPageCount } from '#utils/database-pagination.js';
import { sortAppeals } from '#utils/appeal-sorter.js';
import logger from '#utils/logger.js';
import stringTokenReplacement from '#utils/string-token-replacement.js';
import {
	AUDIT_TRAIL_ASSIGNED_CASE_OFFICER,
	AUDIT_TRAIL_ASSIGNED_INSPECTOR,
	AUDIT_TRAIL_REMOVED_CASE_OFFICER,
	AUDIT_TRAIL_REMOVED_INSPECTOR,
	DEFAULT_PAGE_NUMBER,
	DEFAULT_PAGE_SIZE,
	ERROR_FAILED_TO_SAVE_DATA,
	ERROR_CANNOT_BE_EMPTY_STRING,
	CONFIG_APPEAL_STAGES,
	AUDIT_TRAIL_SYSTEM_UUID,
	STATE_TARGET_READY_TO_START
} from '../constants.js';
import { formatAppeal, formatAppeals, formatMyAppeals } from './appeals.formatter.js';
import { assignUser, assignedUserType } from './appeals.service.js';
import transitionState from '#state/transition-state.js';

/** @typedef {import('express').Request} Request */
/** @typedef {import('express').Response} Response */

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
const getAppeals = async (req, res) => {
	const { query } = req;
	const pageNumber = Number(query.pageNumber) || DEFAULT_PAGE_NUMBER;
	const pageSize = Number(query.pageSize) || DEFAULT_PAGE_SIZE;
	const searchTerm = String(query.searchTerm);

	const [itemCount, appeals = []] = await appealRepository.getAllAppeals(
		pageNumber,
		pageSize,
		searchTerm
	);
	const formattedAppeals = appeals.map((appeal) => formatAppeals(appeal));

	return res.send({
		itemCount,
		items: formattedAppeals,
		page: pageNumber,
		pageCount: getPageCount(itemCount, pageSize),
		pageSize
	});
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
const getMyAppeals = async (req, res) => {
	const { query } = req;
	const pageNumber = Number(query.pageNumber) || DEFAULT_PAGE_NUMBER;
	const pageSize = Number(query.pageSize) || DEFAULT_PAGE_SIZE;
	const status = String(query.status);
	const azureUserId = req.get('azureAdUserId');

	if (azureUserId) {
		const [itemCount, appeals = []] = await appealRepository.getUserAppeals(
			azureUserId,
			pageNumber,
			pageSize,
			status
		);
		const formattedAppeals = sortAppeals(appeals.map((appeal) => formatMyAppeals(appeal)));

		return res.send({
			itemCount,
			items: formattedAppeals,
			page: pageNumber,
			pageCount: getPageCount(itemCount, pageSize),
			pageSize
		});
	}

	return res.status(404).send({ errors: { azureUserId: ERROR_CANNOT_BE_EMPTY_STRING } });
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
const getAppealById = async (req, res) => {
	const { appeal } = req;
	const folders = await getFoldersForAppeal(appeal, CONFIG_APPEAL_STAGES.decision);
	const formattedAppeal = formatAppeal(appeal, folders);

	return res.send(formattedAppeal);
};

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 */
const updateAppealById = async (req, res) => {
	const {
		appeal,
		body,
		body: { caseOfficer, inspector, startedAt },
		params
	} = req;
	const appealId = Number(params.appealId);

	try {
		if (assignedUserType({ caseOfficer, inspector })) {
			await assignUser(appealId, { caseOfficer, inspector });

			let details = '';
			let isCaseOfficerAssignment = false;

			if (caseOfficer) {
				isCaseOfficerAssignment = true;
				details = stringTokenReplacement(AUDIT_TRAIL_ASSIGNED_CASE_OFFICER, [caseOfficer]);
			} else if (inspector) {
				details = stringTokenReplacement(AUDIT_TRAIL_ASSIGNED_INSPECTOR, [inspector]);
			} else if (caseOfficer === null && appeal.caseOfficer) {
				details = stringTokenReplacement(AUDIT_TRAIL_REMOVED_CASE_OFFICER, [
					appeal.caseOfficer.azureAdUserId
				]);
			} else if (inspector === null && appeal.inspector) {
				details = stringTokenReplacement(AUDIT_TRAIL_REMOVED_INSPECTOR, [
					appeal.inspector.azureAdUserId
				]);
			}

			const azureUserId = req.get('azureAdUserId');
			await createAuditTrail({
				appealId: appeal.id,
				details,
				azureAdUserId: req.get('azureAdUserId')
			});

			if (isCaseOfficerAssignment) {
				await transitionState(
					appeal.id,
					appeal.appealType,
					azureUserId || AUDIT_TRAIL_SYSTEM_UUID,
					appeal.appealStatus,
					STATE_TARGET_READY_TO_START
				);
			}
		} else {
			await appealRepository.updateAppealById(appealId, {
				startedAt
			});
		}
	} catch (error) {
		if (error) {
			logger.error(error);
			return res.status(500).send({ errors: { body: ERROR_FAILED_TO_SAVE_DATA } });
		}
	}

	return res.send(body);
};

export { getAppealById, getAppeals, getMyAppeals, updateAppealById };
