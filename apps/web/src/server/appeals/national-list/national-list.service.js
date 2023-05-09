import { get } from '../../lib/request.js';

/** @typedef {import('@pins/appeals').AppealSummary} AppealSummary */

/**
 * @returns {Promise<AppealSummary[]>}
 */
export const findAllAppeals = () => get('appeals/');
