/**
 * @param {Record<string, any>} validationErrors
 * @param {Record<string, string>} data
 */
export default function addEnteredDatesToValidationErrors(validationErrors, data) {
	Object.entries(validationErrors).forEach(([fieldName, error]) => {
		if (Object.keys(data).includes(`${fieldName}.day`)) {
			error.value = {
				year: data[`${fieldName}.year`],
				month: data[`${fieldName}.month`],
				day: data[`${fieldName}.day`]
			};
		}
	});
}
