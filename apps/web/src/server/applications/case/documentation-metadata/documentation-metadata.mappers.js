/**
 * Map submitted metadata form values to the shape expected by the API.
 *
 * @param {string} metaDataName
 * @param {Record<string, any>} body
 * @param {import('../../applications.types.d.ts').DocumentationFile} [documentMetaData]
 * @returns {Record<string, any>}
 */
export const mapMetadataFormToApi = (metaDataName, body, documentMetaData) => {
	if (metaDataName === 'examination-library-category') {
		const selectedCategoryId =
			body.examinationLibraryCategoryId === 'APP'
				? body.examinationLibraryCategoryChild
				: body.examinationLibraryCategoryId;

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

		return {
			examinationRefNo: `${documentMetaData?.examinationLibraryCategoryCode}-${body.examinationRefNo}`
		};
	}

	return body;
};
