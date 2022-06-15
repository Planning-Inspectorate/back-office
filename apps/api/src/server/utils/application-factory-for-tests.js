/**
 * 
 * @returns {string}
 */
const generateApplicationReference = () => {
    const number = Math.floor(Math.random() * (1 - 999_999) + 1);

	return `APP/Q9999/D/21/${number}`;
}

/**
 * @template T
 * @param {T[]} list
 * @returns {T} list
 */
 function pickRandom(list) {
	return list[Math.floor(Math.random() * list.length)];
}

/**
 * 
 * @param {number} applicationId 
 * @param {string} status
 * @param {Date} modifiedAt
 * @returns 
 */
export const applicationFactorForTests = ({
    applicationId,
    status = 'open',
    modifiedAt = new Date()
}) => {
    return {
        id: applicationId,
        reference: generateApplicationReference(),
        status,
        modifiedAt,

    }
}
