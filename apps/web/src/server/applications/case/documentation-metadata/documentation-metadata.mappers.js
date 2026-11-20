const groupedCategoryCodes = ['APP', 'EVX', 'PDX', 'REPX'];
/**
 * Map submitted metadata form values to the shape expected by the API.
 *
 * @param {string} metaDataName
 * @param {Record<string, any>} body
 * @param {Record<string, any>} [documentMetaData]
 * @returns {Record<string, any>}
 */
export const mapMetadataFormToApi = (metaDataName, body, documentMetaData) => {
	if (metaDataName === 'examination-library-category') {
		const selectedCategory = body.examinationLibraryCategoryId;
		const selectedCategoryId = groupedCategoryCodes.includes(selectedCategory)
			? body[`examinationLibraryCategoryChild${selectedCategory}`]
			: selectedCategory;
		return {
			examinationLibraryCategoryId: Number(selectedCategoryId)
		};
	}

	if (metaDataName === 'examination-library-reference') {
		if (body.examinationLibraryReferenceType === 'automatic') {
			return {
				examinationRefNo: null
			};
		}
		if (body.examinationLibraryReferenceType === 'manual') {
			return {
				examinationRefNo: `${documentMetaData?.examinationLibraryCategoryCode}-${body.examinationRefNo}`
			};
		}
	}
	return body;
};
