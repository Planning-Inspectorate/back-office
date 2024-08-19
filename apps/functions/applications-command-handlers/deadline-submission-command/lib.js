/**
 * @typedef {Object} ExaminationTimetableItem
 * @property {number} id
 * @property {string} name
 * @property {string | null} nameWelsh
 * @property {string} description
 * @property {string | null} descriptionWelsh
 * */

/**
 *
 * @param {ExaminationTimetableItem} timetableItem
 * @param {string} lineItem
 * @returns {boolean}
 * */
function lineItemExists(timetableItem, lineItem) {
	/** @type {{ bulletPoints: string[] }} */
	const { bulletPoints } = JSON.parse(timetableItem.description);
	return bulletPoints.find((bp) => bp.trim() === lineItem) !== null;
}

/**
 * @param {ExaminationTimetableItem} timetableItem
 * @param {string} englishLineItem
 * @returns {{ nameWelsh: string | null, descriptionWelsh: string | null }}
 * */
function getWelshDetails(timetableItem, englishLineItem) {
	const { nameWelsh, descriptionWelsh: rawDescriptionWelsh } = timetableItem;

	if (!rawDescriptionWelsh) {
		return { nameWelsh, descriptionWelsh: null };
	}

	/** @type {{ bulletPoints: string[] }} */
	const description = JSON.parse(timetableItem.description);
	const lineItemIndex = description.bulletPoints.findIndex(
		(bp) => bp.trim() === englishLineItem.trim()
	);
	if (lineItemIndex === -1) {
		throw new Error(
			`Line item "${englishLineItem}" does not exist on timetable item:\n${JSON.stringify(
				timetableItem
			)}`
		);
	}

	const descriptionWelsh = JSON.parse(rawDescriptionWelsh);
	const welshLineItem = descriptionWelsh.bulletPoints[lineItemIndex];

	return {
		nameWelsh: timetableItem.nameWelsh,
		descriptionWelsh: welshLineItem
	};
}

export default {
	lineItemExists,
	getWelshDetails
};
