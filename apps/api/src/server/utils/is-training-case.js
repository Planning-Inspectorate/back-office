/**
 * Is this a "Training" case? - checks the reference name and/or the sector name, without querying DB
 *
 * @param {string} [reference]
 * @param {string} [sector]
 * @returns {boolean}
 */
export const isTrainingCase = (reference, sector) => {
	return /^TRAIN/.test(reference ?? '') || (sector ?? '') === 'training';
};
