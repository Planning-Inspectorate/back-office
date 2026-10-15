/**
 * @typedef {import('#database-client').Prisma.DocumentGetPayload<{include: {latestDocumentVersion: {include: {ExaminationLibraryCategory: true}}}}>} ExaminationLibraryDocumentWithCategory
 *
 * @typedef {Object} ExaminationLibraryDocument
 * @property {string} documentGuid
 * @property {string} documentExaminationReference
 * @property {string} categoryCode
 * @property {string} categoryName
 *
 * @typedef {Object} ExaminationLibraryPublishPayload
 * @property {string} caseReference
 * @property {ExaminationLibraryDocument[]} examinationDocuments
 *
 * @typedef {Object} ExaminationLibraryUnpublishPayload
 * @property {string} caseReference
 * @property {string[]} categories
 */

/**
 * Builds the payload for broadcasting an examination library publish event.
 *
 * @param {{
 *   caseId?: number,
 *   caseReference: string,
 *   documents: Array<any>,
 *   categoryCode?: string
 * }} publishedCategory
 * @returns {ExaminationLibraryPublishPayload}
 */
export const buildExaminationLibraryPublishPayload = (publishedCategory) => {
	const caseReference = publishedCategory?.caseReference;
	if (!caseReference) {
		throw new Error('Case reference is required for examination library publish payload');
	}

	const documents = publishedCategory?.documents ?? [];
	if (!documents.length) {
		throw new Error(
			'At least one examination document is required for examination library publish payload'
		);
	}

	const examinationDocuments = documents.map((doc) => {
		const docGuid = doc?.guid;
		const docVersion = doc?.latestDocumentVersion;
		const refNo = docVersion?.examinationRefNo;
		const category = docVersion?.ExaminationLibraryCategory;
		const categoryCode = category?.categoryCode || publishedCategory?.categoryCode;
		const categoryName = category?.categoryName;

		const requiredProperties = [
			{ name: 'documentGuid', value: docGuid },
			{ name: 'documentExaminationReference', value: refNo },
			{ name: 'categoryCode', value: categoryCode },
			{ name: 'categoryName', value: categoryName }
		];

		const missingProperties = requiredProperties
			.filter((prop) => !prop.value)
			.map((prop) => prop.name);

		if (missingProperties.length) {
			throw new Error(
				`Document ${docGuid || 'unknown'} is missing required properties (${missingProperties.join(
					', '
				)}) for examination library publishing`
			);
		}

		return {
			documentGuid: docGuid,
			documentExaminationReference: refNo,
			categoryCode,
			categoryName
		};
	});

	return {
		caseReference,
		examinationDocuments
	};
};

/**
 * Builds the payload for broadcasting an examination library unpublish event.
 *
 * @param {{
 *   caseId?: number,
 *   caseReference: string,
 *   categories: string[]
 * }} unpublishedCategory
 * @returns {ExaminationLibraryUnpublishPayload}
 */
export const buildExaminationLibraryUnpublishPayload = (unpublishedCategory) => {
	const caseReference = unpublishedCategory?.caseReference;
	const categories = unpublishedCategory?.categories;

	if (!caseReference || !categories?.length) {
		throw new Error('Case reference and categories are required for unpublish payload');
	}

	return {
		caseReference,
		categories
	};
};
