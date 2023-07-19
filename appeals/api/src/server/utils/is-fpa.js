import { APPEAL_TYPE_SHORTHAND_FPA } from '#endpoints/constants.js';

/** @typedef {import('@pins/appeals.api').Schema.AppealType} AppealType */

/**
 * @param {Pick<AppealType, 'shorthand'> | null} appealType
 * @returns {boolean}
 */
const isFPA = (appealType) =>
	Boolean(appealType && appealType.shorthand === APPEAL_TYPE_SHORTHAND_FPA);

export default isFPA;
