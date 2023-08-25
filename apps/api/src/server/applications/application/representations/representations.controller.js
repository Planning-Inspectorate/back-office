import { sortByFromQuery } from '../../../utils/query/sort-by.js';
import {
	createCaseRepresentation,
	getCaseRepresentation,
	getCaseRepresentations,
	getCaseRepresentationsStatusCount,
	updateCaseRepresentation
} from './representaions.service.js';
import {
	getLatestRedaction,
	mapCaseRepresentationsStatusCount,
	mapCaseRepresentationsUnderCount,
	mapCreateOrUpdateRepRequestToRepository,
	mapDocumentRepresentationAttachments,
	mapRepresentationSummary
} from './representation.mapper.js';

/**
 *
 * @type {import("express").RequestHandler<{id: number, repId: number}, ?, ?, any>}
 */
export const getRepresentation = async ({ params }, response) => {
	const representation = await getCaseRepresentation(params.id, params.repId);

	if (!representation && params.repId) {
		return response
			.status(404)
			.json({ errors: { repId: `Representation with id: ${params.repId} not found` } });
	}

	const latestRedaction = getLatestRedaction(representation);
	representation.attachments = mapDocumentRepresentationAttachments(representation.attachments);

	return response.send({
		...representation,
		redactedBy: latestRedaction?.actionBy,
		redactedNotes: latestRedaction?.notes
	});
};

/**
 *
 * @type {import("express").RequestHandler<{id: number}, ?, ?, any>}
 */
export const getRepresentations = async ({ params, query }, response) => {
	const pageSize = query.pageSize ?? 25;
	const page = query.page ?? 1;
	const under18 = query.under18 ? query.under18 === 'true' : null;
	const status = query.status ? [query.status].flat() : [];

	let filters = null;

	if (status.length > 0 || under18) {
		filters = {
			...(under18 ? { under18 } : {}),
			...(status.length > 0 ? { status } : {})
		};
	}

	let sort = null;
	const sortBy = sortByFromQuery(query.sortBy);
	if (sortBy) {
		sort = [sortBy];
	}

	const { count, items } = await getCaseRepresentations(
		params.id,
		{ page, pageSize },
		{
			searchTerm: query.searchTerm,
			filters,
			sort
		}
	);

	const [representationCountStatus, under18Data] = await getCaseRepresentationsStatusCount(
		params.id
	);

	response.send({
		page,
		pageSize,
		filters: [
			mapCaseRepresentationsUnderCount(under18Data),
			...mapCaseRepresentationsStatusCount(representationCountStatus)
		],
		pageCount: Math.ceil(Math.max(1, count) / pageSize),
		itemCount: count,
		items: items.map(mapRepresentationSummary)
	});
};

/**
 *
 * @type {import("express").RequestHandler<{id: number}, ?, import("@pins/applications").CreateUpdateRepresentation>}
 */
export const patchRepresentation = async ({ params, body, method }, response) => {
	const { id: caseId, repId: representationId } = params;

	if (Object.keys(body).length === 0) {
		return response.status(400).json({ errors: { representation: `Request body empty` } });
	}

	const mappedRepresentation = mapCreateOrUpdateRepRequestToRepository(caseId, body, method);

	const representation = await updateCaseRepresentation(
		mappedRepresentation,
		Number(caseId),
		Number(representationId)
	);

	if (!representation) {
		return response
			.status(400)
			.json({ errors: { representation: `Error updating representation` } });
	}

	return response.send({ id: representation.id, status: representation.status });
};

/**
 *
 * @type {import("express").RequestHandler<{id: number}, ?, import("@pins/applications").CreateUpdateRepresentation>}
 */
export const createRepresentation = async ({ params, body }, response) => {
	const mappedRepresentation = mapCreateOrUpdateRepRequestToRepository(params.id, body);

	const representation = await createCaseRepresentation(mappedRepresentation);

	if (!representation) {
		return response
			.status(400)
			.json({ errors: { representation: `Error creating representation` } });
	}

	return response.send({ id: representation.id, status: representation.status });
};
