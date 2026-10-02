/**
 * Map submitted metadata form values to the shape expected by the API.
 *
 * @param {string} metaDataName
 * @param {Record<string, any>} body
 * @returns {Record<string, any>}
 */
export const mapMetadataFormToApi = (metaDataName, body) => {
	if (metaDataName === 'examination-library-category') {
		const selectedCategoryId =
			body.examinationLibraryCategoryId === 'APP'
				? body.examinationLibraryCategoryChild
				: body.examinationLibraryCategoryId;

		return {
			examinationLibraryCategoryId: Number(selectedCategoryId)
		};
	}

	return body;
};
