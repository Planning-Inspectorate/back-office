import usersService from '#appeals/appeal-users/users-service.js';

/** @typedef {import('@pins/appeals.api/src/server/endpoints/appeals').GetAuditTrailsResponse} GetAuditTrailsResponse */
/** @typedef {import('#app/auth/auth-session.service').SessionWithAuth} SessionWithAuth */

/**
 *
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @returns {Promise<GetAuditTrailsResponse>}
 */
export async function getAppealAudit(apiClient, appealId) {
	return await apiClient.get(`appeals/${appealId}/audit-trails`).json();
}

/**
 *
 * @param {string} id
 * @param {SessionWithAuth} session
 * @returns {Promise<string>}
 */
export const mapUser = async (id, session) => {
	const result = await tryMapUsers(id, session);
	return result;
};

/**
 * @param {import('../appeal-details.types.js').WebAppeal} appeal
 * @param {string} log
 * @param {{ documentGuid: string, name: string, stage: string, folderId: number } | undefined } docInfo
 * @param {SessionWithAuth} session
 * @returns {Promise<string>}
 */
export const mapMessageContent = async (appeal, log, docInfo, session) => {
	let result = log;
	result = await tryMapUsers(result, session);
	result = await tryMapDocument(appeal.appealId, result, docInfo, appeal.lpaQuestionnaireId);
	result = await tryMapStatus(result);
	result = await tryMapUrl(result);

	return result;
};

/**
 * Regex for extracting UUIDs
 */
const uuidRegex =
	/^(.*)([0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12})(.*)$/;

/**
 *
 * @param {string} log
 * @param {SessionWithAuth} session
 * @returns {Promise<string>}
 */
const tryMapUsers = async (log, session) => {
	let result = log.replace('00000000-0000-0000-0000-000000000000', 'System');
	const uuid = uuidRegex.exec(result);
	if (uuid) {
		const user = await usersService.getUserById(uuid[2], session);
		result = result.replace(uuid[2], user?.email || 'User not found!');
	}
	return result;
};

/**
 *
 * @param {number} appealId
 * @param {string} log
 * @param {{ documentGuid: string, name: string, stage: string, folderId: number } | undefined } docInfo
 * @param {number | null} lpaqId
 * @returns {Promise<string>}
 */
const tryMapDocument = async (appealId, log, docInfo, lpaqId) => {
	if (!docInfo) {
		return log;
	}

	const { name, documentGuid, stage, folderId } = docInfo;

	if (name && documentGuid && stage && folderId) {
		switch (stage) {
			case 'appellant_case': {
				const url = `/appeals-service/appeal-details/${appealId}/appellant-case/manage-documents/${folderId}/${documentGuid}`;
				return log.replace(name, `<a class="govuk-link" href="${url}">${name}</a>`);
			}
			case 'lpa_questionnaire': {
				if (!lpaqId) {
					break;
				}

				const url = `/appeals-service/appeal-details/${appealId}/lpa-questionnaire/${lpaqId}/manage-documents/${folderId}/${documentGuid}`;
				return log.replace(name, `<a class="govuk-link" href="${url}">${name}</a>`);
			}
		}
	}

	return log;
};

/**
 *
 * @param {string} log
 * @returns {Promise<string>}
 */
const tryMapStatus = async (log) => {
	let result = log;
	result = result.replace(
		'ready_to_start',
		'<strong class="govuk-tag govuk-tag--turquoise single-line govuk-!-margin-bottom-4">Ready to start</strong>'
	);
	result = result.replace(
		'lpa_questionnaire_due',
		'<strong class="govuk-tag govuk-tag--yellow single-line govuk-!-margin-bottom-4">LPA questionnaire</strong>'
	);
	result = result.replace(
		'withdrawn',
		'<strong class="govuk-tag govuk-tag--yellow single-line govuk-!-margin-bottom-4">Withdrawn</strong>'
	);
	result = result.replace(
		'awaiting_transfer',
		'<strong class="govuk-tag govuk-tag--yellow single-line govuk-!-margin-bottom-4">Awaiting transfer</strong>'
	);
	result = result.replace(
		'transferred',
		'<strong class="govuk-tag govuk-tag--yellow single-line govuk-!-margin-bottom-4">Transferred</strong>'
	);
	result = result.replace(
		'closed',
		'<strong class="govuk-tag govuk-tag--yellow single-line govuk-!-margin-bottom-4">Closed</strong>'
	);
	result = result.replace(
		'invalid',
		'<strong class="govuk-tag govuk-tag--yellow single-line govuk-!-margin-bottom-4">Invalid</strong>'
	);
	result = result.replace(
		'issue_determination',
		'<strong class="govuk-tag govuk-tag--pink single-line govuk-!-margin-bottom-4">Issue determination</strong>'
	);
	result = result.replace(
		'complete',
		'<strong class="govuk-tag govuk-tag--green single-line govuk-!-margin-bottom-4">Complete</strong>'
	);

	return result;
};

/**
 *
 * @param {string} log
 * @returns {Promise<string>}
 */
const tryMapUrl = async (log) => {
	return log;
};
