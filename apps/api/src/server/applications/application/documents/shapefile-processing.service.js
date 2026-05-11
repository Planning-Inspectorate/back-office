import * as documentRepository from '#repositories/document.repository.js';
import * as documentVersionRepository from '#repositories/document-metadata.repository.js';
import * as documentActivityLogRepository from '#repositories/document-activity-log.repository.js';
import * as folderRepository from '#repositories/folder.repository.js';
import * as caseRepository from '#repositories/case.repository.js';
import { broadcastNsipDocumentEvent } from '#infrastructure/event-broadcasters.js';
import { EventType } from '@pins/event-client';
import logger from '#utils/logger.js';
import {
	GIS_SHAPEFILES_FOLDER_NAME,
	GIS_SHAPEFILE_DOCUMENT_TYPE,
	GIS_SHAPEFILE_WEBFILTER,
	GIS_SHAPEFILE_REDACTED_STATUS,
	GIS_SHAPEFILE_STAGE,
	SYSTEM_USER_NAME,
	DocumentPublishedStatus
} from '../../constants.js';

/**
 * Checks whether a document (by guid) lives in the GIS Shapefiles folder.
 *
 * @param {string} documentGuid
 * @returns {Promise<boolean>}
 */
export const isDocumentInGisShapefilesFolder = async (documentGuid) => {
	const document = await documentRepository.getById(documentGuid);
	if (!document) {
		logger.warn(`[SHAPEFILE] Document ${documentGuid} is not in GIS Shapefiles folder`);
		return false;
	}

	const folder = await folderRepository.getById(document.folderId);
	return folder?.displayNameEn === GIS_SHAPEFILES_FOLDER_NAME;
};

/**
 * Marks a document version as invalid (failed shapefile processing).
 *
 * @param {string} documentGuid
 * @returns {Promise<void>}
 */
export const markDocumentAsInvalid = async (documentGuid) => {
	const document = await documentRepository.getById(documentGuid);
	if (!document) {
		logger.warn(`[SHAPEFILE] Cannot mark as invalid: document not found ${documentGuid}`);
		return;
	}

	const version = document.latestVersionId ?? 1;
	const updated = await documentVersionRepository.updateDocumentVersion(documentGuid, version, {
		publishedStatus: DocumentPublishedStatus.INVALID,
		publishedStatusPrev: DocumentPublishedStatus.NOT_CHECKED
	});

	await documentActivityLogRepository.create({
		documentGuid,
		version,
		user: SYSTEM_USER_NAME,
		status: DocumentPublishedStatus.INVALID
	});

	await broadcastNsipDocumentEvent(updated, EventType.Update);

	logger.info(`[SHAPEFILE] Marked document ${documentGuid} as invalid`);
};

/**
 * Creates a new GeoJSON document version on the source ZIP document record,
 * storing the GeoJSON blob path and applying all required metadata.
 *
 * @param {{
 *   documentGuid: string,
 *   caseId: number,
 *   geoJsonFileName: string,
 *   geoJsonBlobPath: string,
 *   blobContainer: string,
 *   geoJsonSizeBytes: number,
 * }} params
 * @returns {Promise<void>}
 */
export const createGeoJsonDocumentVersion = async ({
	documentGuid,
	caseId,
	geoJsonFileName,
	geoJsonBlobPath,
	blobContainer,
	geoJsonSizeBytes
}) => {
	const [caseRecord, document] = await Promise.all([
		caseRepository.getById(caseId, { applicant: true }),
		documentRepository.getByIdWithVersion(documentGuid)
	]);

	if (!caseRecord) throw new Error(`Case not found: ${caseId}`);
	if (!document) throw new Error(`Document not found: ${documentGuid}`);

	const currentVersion = document.latestVersionId ?? 1;
	const newVersion = currentVersion + 1;

	// Copy metadata from the current version, overriding GIS-specific fields
	const currentVersionData = document.documentVersion?.find(
		(/** @type {{ version: number }} */ v) => v.version === currentVersion
	);

	const applicantName = caseRecord.applicant?.organisationName ?? '';

	/** @type {import('#database-client').Prisma.DocumentVersionUncheckedCreateInput} */
	const newVersionData = {
		documentGuid,
		version: newVersion,
		fileName: geoJsonFileName.replace(/\.geojson$/i, ''),
		originalFilename: geoJsonFileName,
		description: caseRecord.description ?? '',
		mime: 'application/geo+json',
		size: geoJsonSizeBytes,
		sourceSystem: 'back-office-applications',
		stage: GIS_SHAPEFILE_STAGE,
		filter1: GIS_SHAPEFILE_WEBFILTER,
		author: applicantName,
		redactedStatus: GIS_SHAPEFILE_REDACTED_STATUS,
		documentType: GIS_SHAPEFILE_DOCUMENT_TYPE,
		publishedStatus: DocumentPublishedStatus.NOT_CHECKED,
		privateBlobContainer: blobContainer,
		privateBlobPath: geoJsonBlobPath,
		dateCreated: new Date(),
		// Pre-populate case metadata fields
		representative: caseRecord.reference ?? '',
		owner: SYSTEM_USER_NAME,
		...(currentVersionData?.filter1Welsh ? { filter1Welsh: GIS_SHAPEFILE_WEBFILTER } : {}),
		...(currentVersionData?.authorWelsh ? { authorWelsh: applicantName } : {})
	};

	await documentVersionRepository.upsert(newVersionData);

	await documentRepository.update(documentGuid, {
		latestVersionId: newVersion
	});

	await documentActivityLogRepository.create({
		documentGuid,
		version: newVersion,
		user: SYSTEM_USER_NAME,
		status: 'uploaded'
	});

	const updatedVersion = await documentVersionRepository.getById(documentGuid, newVersion);
	if (updatedVersion) {
		await broadcastNsipDocumentEvent(updatedVersion, EventType.Update);
	}

	logger.info(
		`[SHAPEFILE] Created GeoJSON document version ${newVersion} for document ${documentGuid}`
	);
};
