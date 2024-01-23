/**
 * Remove trailing line breaks from the preText and each bulletPoint
 * within the examinationTimetableItemDescription
 *
 * @param {string} examinationTimetableItemDescription
 * @returns {string} formatedExaminationTimetableItemDescription
 */
export const mapExaminationTimetableItemDescriptionToSave = (
	examinationTimetableItemDescription
) => {
	const { preText = '', bulletPoints = [] } = JSON.parse(examinationTimetableItemDescription);
	const formattedDescription = {
		preText: preText.trim(),
		bulletPoints: bulletPoints.map((bulletPoint) => bulletPoint.trim())
	};
	return JSON.stringify(formattedDescription);
};

/**
 * Add trailing line breaks from the preText and each bulletPoint
 * within the examinationTimetableItemDescription
 *
 * @param {string} examinationTimetableItemDescription
 * @returns {string} formatedExaminationTimetableItemDescription
 */
export const mapExaminationTimetableItemDescriptionToView = (
	examinationTimetableItemDescription
) => {
	const { preText = '', bulletPoints = [] } = JSON.parse(examinationTimetableItemDescription);
	const formattedDescription = {
		preText: preText.trim() + `\r\n`,
		bulletPoints: bulletPoints.map(
			(bulletPoint, index) =>
				' ' + bulletPoint.trim() + (index < bulletPoints.length - 1 ? `\r\n` : '')
		)
	};
	return JSON.stringify(formattedDescription);
};
