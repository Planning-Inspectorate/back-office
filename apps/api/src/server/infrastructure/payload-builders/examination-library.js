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

const REQUIRED_DOCUMENT_PROPERTIES = [
	'documentGuid',
	'documentExaminationReference',
	'categoryCode',
	'categoryName'
];

/**
 * Validates that the examination library publish payload matches the required shape.
 *
 * @param {any} payload
 * @returns {ExaminationLibraryPublishPayload}
 * @throws {Error} if payload does not conform to the shape
 */
export const validateExaminationLibraryPublishPayload = (payload) => {
	if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
		throw new Error('Examination library publish payload must be an object');
	}

	if (
		!payload.caseReference ||
		typeof payload.caseReference !== 'string' ||
		!payload.caseReference.trim()
	) {
		throw new Error('Case reference is required for examination library publish payload');
	}

	if (!Array.isArray(payload.examinationDocuments) || payload.examinationDocuments.length === 0) {
		throw new Error(
			'At least one examination document is required for examination library publish payload'
		);
	}

	for (let i = 0; i < payload.examinationDocuments.length; i++) {
		const doc = payload.examinationDocuments[i];
		if (!doc || typeof doc !== 'object' || Array.isArray(doc)) {
			throw new Error(`Examination document at index ${i} must be an object`);
		}

		const missingProperties = REQUIRED_DOCUMENT_PROPERTIES.filter(
			(prop) => !doc[prop] || typeof doc[prop] !== 'string' || !doc[prop].trim()
		);

		if (missingProperties.length > 0) {
			throw new Error(
				`Document ${doc.documentGuid || 'unknown'} is missing required properties (${missingProperties.join(
					', '
				)}) for examination library publishing`
			);
		}
	}

	return payload;
};

/**
 * Validates that the examination library unpublish payload matches the required shape.
 *
 * @param {any} payload
 * @returns {ExaminationLibraryUnpublishPayload}
 * @throws {Error} if payload does not conform to the shape
 */
export const validateExaminationLibraryUnpublishPayload = (payload) => {
	if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
		throw new Error('Examination library unpublish payload must be an object');
	}

	if (
		!payload.caseReference ||
		typeof payload.caseReference !== 'string' ||
		!payload.caseReference.trim()
	) {
		throw new Error('Case reference and categories are required for unpublish payload');
	}

	if (!Array.isArray(payload.categories) || payload.categories.length === 0) {
		throw new Error('Case reference and categories are required for unpublish payload');
	}

	const hasInvalidCategory = payload.categories.some(
		(/** @type {unknown} */ category) =>
			!category || typeof category !== 'string' || !category.trim()
	);
	if (hasInvalidCategory) {
		throw new Error('Case reference and categories are required for unpublish payload');
	}

	return payload;
};

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
	const documents = publishedCategory?.documents;

	if (!caseReference || typeof caseReference !== 'string' || !caseReference.trim()) {
		throw new Error('Case reference is required for examination library publish payload');
	}

	if (!Array.isArray(documents) || documents.length === 0) {
		throw new Error(
			'At least one examination document is required for examination library publish payload'
		);
	}

	const examinationDocuments = documents.map((doc) => {
		const docGuid = doc?.guid;
		const docVersion = doc?.latestDocumentVersion;
		const refNo = docVersion?.examinationRefNo;
		const category = docVersion?.ExaminationLibraryCategory;
		const categoryCode = category?.categoryCode;
		const categoryName = category?.categoryName;

		return {
			documentGuid: docGuid,
			documentExaminationReference: refNo,
			categoryCode,
			categoryName
		};
	});

	return validateExaminationLibraryPublishPayload({
		caseReference,
		examinationDocuments
	});
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

	return validateExaminationLibraryUnpublishPayload({
		caseReference,
		categories
	});
};
