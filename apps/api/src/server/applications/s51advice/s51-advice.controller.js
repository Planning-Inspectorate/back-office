import { pick } from 'lodash-es';
import { mapS51Advice } from '#utils/mapping/map-s51-advice-details.js';
import * as s51AdviceRepository from '../../repositories/s51-advice.repository.js';
import { getCaseDetails } from '../application/application.service.js';
import { getManyS51AdviceOnCase } from './s51-advice.service.js';
import * as s51AdviceDocumentRepository from '../../repositories/s51-advice-document.repository.js';
import * as caseRepository from '../../repositories/case.repository.js';
import {
	makeDocumentReference,
	obtainURLsForDocuments
} from './../application/documents/document.service.js';

/** @typedef {import('@pins/applications.api').Schema.Folder} Folder */

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const createS51Advice = async (_request, response) => {
	const { body } = _request;
	const { caseId } = body;

	const latestReferenceNumber = await s51AdviceRepository.getS51AdviceCountOnCase(caseId);
	const newReferenceNumber = latestReferenceNumber + 1;

	const payload = { ...body, referenceNumber: newReferenceNumber };
	const s51Advice = await s51AdviceRepository.create(payload);

	response.send(s51Advice);
};

/**

 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const getS51Advice = async (_request, response) => {
	const { adviceId, id } = _request.params;

	//get the case Reference name - needed for the formatted advice ReferenceNumbers
	const caseDetails = await getCaseDetails(+id, {});
	// @ts-ignore
	const caseRef = caseDetails.reference;
	const s51Advice = await s51AdviceRepository.get(Number(adviceId));

	if (!s51Advice) {
		// @ts-ignore
		return response
			.status(404)
			.json({ errors: { message: `S51 advice with id: ${adviceId} not found.` } });
	}

	const mappeds51Advice = mapS51Advice(caseRef, s51Advice);

	response.send(mappeds51Advice);
};

/**
 * Gets paginated array of S51 Advice records on a case
 *
 * @type {import('express').RequestHandler<{ id: number }, ?, {pageNumber?: number, pageSize?: number}, any>}
 */
export const getManyS51Advices = async ({ params, body }, response) => {
	const { id } = params;
	const { pageNumber, pageSize } = body;
	const paginatedS51Advices = await getManyS51AdviceOnCase(id, pageNumber, pageSize);

	response.send(paginatedS51Advices);
};

/**
 * @type {import('express').RequestHandler}
 * @throws {Error}
 * @returns {Promise<void>}
 */
export const addDocuments = async ({ params, body }, response) => {
	const adviceId = Number(params.adviceId);
	const s51Advice = s51AdviceRepository.get(adviceId);

	if (!s51Advice) {
		// @ts-ignore
		return response
			.status(404)
			.json({ errors: { message: `S51 advice with id: ${adviceId} not found.` } });
	}

	const documentsToUpload = body;
	const caseId = Number(params.id);

	const existingS51ForCase = await s51AdviceRepository.getLatestRecordByCaseId(caseId);

	const theCase = await caseRepository.getById(caseId, {
		applicationDetails: true,
		gridReference: true
	});

	if (!theCase || !theCase.reference) {
		// @ts-ignore
		return response.status(404).json({ errors: { message: `Case with id: ${caseId} not found.` } });
	}

	let nextReferenceIndex = existingS51ForCase?.referenceNumber
		? existingS51ForCase?.referenceNumber + 1
		: 1;

	for (const doc of documentsToUpload) {
		doc.documentReference = makeDocumentReference(theCase.reference, nextReferenceIndex);
		doc.folderId = Number(doc.folderId);
		nextReferenceIndex++;
	}

	// Obtain URLs for documents from blob storage
	const { response: dbResponse, failedDocuments } = await obtainURLsForDocuments(
		documentsToUpload,
		caseId
	);

	if (dbResponse === null) {
		response.status(409).send({ failedDocuments });
		return;
	}

	const { blobStorageHost, privateBlobContainer, documents } = dbResponse;

	/**
	 * @type {import("../../../database/schema.js").CreateS51AdviceDocument[]}
	 */
	const s51Documents = [];
	documents.forEach((doc) => {
		s51Documents.push({
			adviceId,
			documentGuid: doc.GUID
		});
	});

	if (s51Documents.length > 0) {
		await s51AdviceDocumentRepository.create(s51Documents);
	}

	// Map the obtained URLs with documentName
	const documentsWithUrls = documents.map((document) => {
		return pick(document, ['documentName', 'documentReference', 'blobStoreUrl', 'GUID']);
	});

	// Send response with blob storage host, container, and documents with URLs
	response.status(failedDocuments.length > 0 ? 206 : 200).send({
		blobStorageHost,
		privateBlobContainer,
		documents: documentsWithUrls,
		failedDocuments
	});
};
