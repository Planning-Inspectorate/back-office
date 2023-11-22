import logger from '#lib/logger.js';

/**
 *
 * @param {MappedInstructions} instructions
 * @returns {boolean}
 */
export function areIdsDefinedAndUnique(instructions) {
	const idSet = new Set();
	for (const key in instructions) {
		const nestedObjectId = instructions[key].id;
		if (nestedObjectId === undefined) {
			logger.error(`${nestedObjectId} is undefined`);
			return false;
		}
		if (idSet.has(nestedObjectId)) {
			logger.error(`${nestedObjectId} is duplicated`);
			return false;
		}
		idSet.add(nestedObjectId);
	}
	return true;
}
