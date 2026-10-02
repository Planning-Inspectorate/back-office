/**
 * @typedef {import('#database-client').Prisma.DocumentGetPayload<{
 * 	include: {
 * 		latestDocumentVersion: {
 * 			include: {
 * 				ExaminationLibraryCategory: true
 * 			}
 * 		}
 * 	}
 * }>} ExaminationLibraryDocument
 */

const PARTY_TYPE_ORDER = [
	'Applicant',
	'Local authority',
	'Other council',
	'Statutory body',
	'Interested organisation',
	'Individual',
	'Planning Inspectorate'
];

const SORTABLE_FIELDS = new Set(['description', 'author', 'publishedStatus', 'examinationRefNo']);

/**
 * Compare nullable strings alphabetically, placing missing values last.
 *
 * @param {string | null | undefined} firstValue
 * @param {string | null | undefined} secondValue
 * @returns {number}
 */
const compareNullableStrings = (firstValue, secondValue) => {
	if (!firstValue && !secondValue) {
		return 0;
	}

	if (!firstValue) {
		return 1;
	}

	if (!secondValue) {
		return -1;
	}

	return firstValue.localeCompare(secondValue);
};

/**
 * Compare party types using the Examination Library hierarchy.
 * Missing or unknown party types are placed last.
 *
 * @param {string | null | undefined} firstPartyType
 * @param {string | null | undefined} secondPartyType
 * @returns {number}
 */
const comparePartyTypes = (firstPartyType, secondPartyType) => {
	const firstPartyIndex = PARTY_TYPE_ORDER.indexOf(firstPartyType ?? '');
	const secondPartyIndex = PARTY_TYPE_ORDER.indexOf(secondPartyType ?? '');

	const firstPartyOrder = firstPartyIndex === -1 ? PARTY_TYPE_ORDER.length : firstPartyIndex;

	const secondPartyOrder = secondPartyIndex === -1 ? PARTY_TYPE_ORDER.length : secondPartyIndex;

	return firstPartyOrder - secondPartyOrder;
};

/**
 * Compare documents using the default Examination Library hierarchy:
 * type of party -> author -> description.
 *
 * @param {ExaminationLibraryDocument} firstDocument
 * @param {ExaminationLibraryDocument} secondDocument
 * @returns {number}
 */
const compareByDefaultOrder = (firstDocument, secondDocument) => {
	const firstVersion = firstDocument.latestDocumentVersion;
	const secondVersion = secondDocument.latestDocumentVersion;

	const partyTypeComparison = comparePartyTypes(
		firstVersion?.typeOfParty,
		secondVersion?.typeOfParty
	);

	if (partyTypeComparison !== 0) {
		return partyTypeComparison;
	}

	const authorComparison = compareNullableStrings(firstVersion?.author, secondVersion?.author);

	if (authorComparison !== 0) {
		return authorComparison;
	}

	const descriptionComparison = compareNullableStrings(
		firstVersion?.description,
		secondVersion?.description
	);

	if (descriptionComparison !== 0) {
		return descriptionComparison;
	}

	return firstDocument.guid.localeCompare(secondDocument.guid);
};

/**
 * Compare documents using user-selected sorting.
 *
 * @param {ExaminationLibraryDocument} firstDocument
 * @param {ExaminationLibraryDocument} secondDocument
 * @param {Object<string, string>[]} sort
 * @returns {number}
 */
const compareBySelectedSort = (firstDocument, secondDocument, sort) => {
	const firstVersion = firstDocument.latestDocumentVersion;
	const secondVersion = secondDocument.latestDocumentVersion;

	for (const sortObject of sort) {
		const [sortField, direction] = Object.entries(sortObject)[0];

		if (!SORTABLE_FIELDS.has(sortField)) {
			continue;
		}

		const comparison = compareNullableStrings(
			firstVersion?.[sortField],
			secondVersion?.[sortField]
		);

		if (comparison !== 0) {
			return direction === 'desc' ? -comparison : comparison;
		}
	}

	return firstDocument.guid.localeCompare(secondDocument.guid);
};

/**
 * Sort Examination Library documents.
 *
 * Uses the default EL hierarchy when no valid user-selected sort is supplied.
 *
 * @param {ExaminationLibraryDocument[]} documents
 * @param {Object<string, string>[] | null} [sort]
 * @returns {ExaminationLibraryDocument[]}
 */
export const sortExaminationLibraryDocuments = (documents, sort = null) => {
	const validSort = sort?.filter((sortObject) => {
		const sortField = Object.keys(sortObject)[0];
		return SORTABLE_FIELDS.has(sortField);
	});

	return [...documents].sort((firstDocument, secondDocument) => {
		if (!validSort?.length) {
			return compareByDefaultOrder(firstDocument, secondDocument);
		}

		return compareBySelectedSort(firstDocument, secondDocument, validSort);
	});
};
