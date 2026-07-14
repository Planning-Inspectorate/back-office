import JSZip from 'jszip';
import XlsxPopulate from 'xlsx-populate';

import config from '#config/config.js';

import { BlobStorageClient } from '@pins/blob-storage-client';
import { getByRef } from '#repositories/case.repository.js';
import { getFolderByNameAndCaseId } from '#repositories/folder.repository.js';
import { updateDocumentVersion } from '#repositories/document-metadata.repository.js';
import {
	getInFolderByName,
	getLatestDocReferenceByCaseIdExcludingMigrated,
	getUnpublishedGisBoundaryDocuments
} from '#repositories/document.repository.js';
import {
	createDocuments,
	makeDocumentReference,
	getIndexFromReference,
	publishDocuments
} from '../../applications/application/documents/document.service.js';

import {
	DocumentPublishedStatus,
	GIS_SHAPEFILE_DESCRIPTION,
	GIS_SHAPEFILE_DOCUMENT_TYPE,
	GIS_SHAPEFILE_REDACTED_STATUS,
	GIS_SHAPEFILE_STAGE,
	GIS_SHAPEFILE_WEBFILTER,
	GIS_SHAPEFILES_FOLDER_NAME,
	SYSTEM_USER_NAME
} from '#api-constants';
import logger from '#utils/logger.js';

const parseSpreadsheet = async (spreadsheetBuffer) => {
	const workbook = await XlsxPopulate.fromDataAsync(spreadsheetBuffer);
	const sheet = workbook.sheet(0);

	const usedRange = sheet.usedRange();
	const maxRow = usedRange.endCell().rowNumber();

	const lookup = new Map();

	for (let row = 2; row <= maxRow; row++) {
		const id = sheet.cell(row, 1).value()?.toString()?.trim();

		const rawReceivedDate = sheet.cell(row, 10).value();

		const receivedDate =
			typeof rawReceivedDate === 'number'
				? XlsxPopulate.numberToDate(rawReceivedDate).toISOString().split('T')[0]
				: rawReceivedDate?.toString()?.trim();

		if (!id) {
			continue;
		}

		lookup.set(id, {
			id,
			caseReference: sheet.cell(row, 2).value()?.toString()?.trim(),
			projectName: sheet.cell(row, 3).value()?.toString()?.trim(),
			applicantName: sheet.cell(row, 4).value()?.toString()?.trim(),
			receivedDate
		});
	}

	return lookup;
};

const inspectZip = async (zipBuffer) => {
	const zipArchive = await JSZip.loadAsync(zipBuffer);

	const files = Object.entries(zipArchive.files)
		.filter(([, entry]) => !entry.dir)
		.map(([name]) => name);

	const spreadsheet = files.find((name) => name.toLowerCase().endsWith('.xlsx'));

	const gpkgFiles = files.filter((name) => name.toLowerCase().endsWith('.gpkg'));

	return {
		zipArchive,
		spreadsheet,
		gpkgFiles
	};
};

const extractDocumentIdFromFileName = (fileName) => {
	return fileName.split('_')[0];
};

const buildGeoJson = (feature, metadata) => ({
	type: 'FeatureCollection',
	features: [
		{
			type: 'Feature',
			geometry: feature.geometry,
			properties: {
				caseReference: metadata.caseReference,
				projectName: metadata.projectName,
				fileName: `${metadata.caseReference}.geojson`,
				receivedDate: metadata.receivedDate
			}
		}
	]
});

const convertGeoPackage = async (gpkgBuffer, metadata) => {
	const { GeoPackageAPI } = await import('@ngageoint/geopackage');

	const gpkg = await GeoPackageAPI.open(gpkgBuffer);

	const featureTable = gpkg.getFeatureTables()[0];

	const feature = gpkg.getFeature(featureTable, 1);

	return buildGeoJson(feature, metadata);
};

const getGisFolder = async (caseId) => {
	const folder = await getFolderByNameAndCaseId(caseId, GIS_SHAPEFILES_FOLDER_NAME);

	if (!folder) {
		throw new Error(`GIS shapefiles folder not found for case ${caseId}`);
	}

	return folder;
};

const createDocumentReference = async (caseId, caseReference) => {
	const latestReference = await getLatestDocReferenceByCaseIdExcludingMigrated({
		caseId
	});

	const lastReferenceIndex = latestReference ? getIndexFromReference(latestReference) : 1;

	return makeDocumentReference(caseReference, lastReferenceIndex + 1);
};

const buildDocumentToCreate = ({ metadata, gisFolder, geoJson, documentReference }) => {
	const geoJsonBuffer = Buffer.from(JSON.stringify(geoJson));

	return {
		documentName: `${metadata.caseReference}.geojson`,
		folderId: gisFolder.id,
		documentType: 'application/geo+json',
		documentSize: geoJsonBuffer.length,
		documentReference,
		author: metadata.applicantName,
		description: GIS_SHAPEFILE_DESCRIPTION,
		username: SYSTEM_USER_NAME,
		sourceSystem: 'back-office-applications'
	};
};

const createGeoJsonDocument = async ({
	caseData,
	gisFolder,
	metadata,
	geoJson,
	documentReference
}) => {
	const documentToCreate = buildDocumentToCreate({
		metadata,
		gisFolder,
		geoJson,
		documentReference
	});

	const result = await createDocuments([documentToCreate], caseData.id);

	return result;
};

const uploadGeoJson = async ({ geoJson, privateBlobContainer, blobStoreUrl }) => {
	if (config.authDisabled) {
		logger.info(`[GIS migration] Auth disabled - skipping blob upload`);

		return;
	}

	const blobClient = BlobStorageClient.fromUrl(config.blobStorageUrl);

	const geoJsonBuffer = Buffer.from(JSON.stringify(geoJson));

	await blobClient.uploadFile(
		privateBlobContainer,
		geoJsonBuffer,
		blobStoreUrl.slice(1),
		'application/geo+json'
	);
};

const applyGisMetadata = async (documentGuid) => {
	await updateDocumentVersion(documentGuid, 1, {
		filter1: GIS_SHAPEFILE_WEBFILTER,
		documentType: GIS_SHAPEFILE_DOCUMENT_TYPE,
		stage: GIS_SHAPEFILE_STAGE,
		redactedStatus: GIS_SHAPEFILE_REDACTED_STATUS
	});
};

export const processHistoricalBoundaries = async (zipBuffer) => {
	const { zipArchive, spreadsheet, gpkgFiles } = await inspectZip(zipBuffer);

	const spreadsheetBuffer = await zipArchive.file(spreadsheet).async('nodebuffer');

	const metadataLookup = await parseSpreadsheet(spreadsheetBuffer);

	const processedFiles = [];
	const skippedFiles = [];
	const failedFiles = [];

	for (const gpkgFile of gpkgFiles) {
		const documentId = extractDocumentIdFromFileName(gpkgFile);

		try {
			const metadata = metadataLookup.get(documentId);

			if (!metadata) {
				skippedFiles.push({
					fileName: gpkgFile,
					reason: 'No matching spreadsheet row'
				});

				continue;
			}

			const gpkgBuffer = await zipArchive.file(gpkgFile).async('nodebuffer');

			const geoJson = await convertGeoPackage(gpkgBuffer, metadata);

			const caseData = await getByRef(metadata.caseReference);

			if (!caseData) {
				skippedFiles.push({
					fileName: gpkgFile,
					reason: `Case not found: ${metadata.caseReference}`
				});

				continue;
			}

			const gisFolder = await getGisFolder(caseData.id);

			const existingBoundary = await getInFolderByName(
				gisFolder.id,
				`${metadata.caseReference}.geojson`
			);

			if (existingBoundary) {
				logger.info(`[GIS migration] Skipping ${metadata.caseReference} - GeoJSON already exists`);

				skippedFiles.push({
					fileName: gpkgFile,
					reason: `GeoJSON document already exists for case ${metadata.caseReference}`
				});

				continue;
			}

			const documentReference = await createDocumentReference(caseData.id, caseData.reference);

			const documentCreation = await createGeoJsonDocument({
				caseData,
				gisFolder,
				metadata,
				geoJson,
				documentReference
			});

			const documentInfo = documentCreation.response.documents[0];

			logger.info(
				`[GIS migration] Uploading ${metadata.caseReference} to ${documentInfo.blobStoreUrl}`
			);

			await uploadGeoJson({
				geoJson,
				privateBlobContainer: documentCreation.response.privateBlobContainer,
				blobStoreUrl: documentInfo.blobStoreUrl
			});

			logger.info(`[GIS migration] Uploaded ${metadata.caseReference}`);

			await applyGisMetadata(documentInfo.GUID);

			processedFiles.push({
				documentId,
				gisFolderId: gisFolder.id,
				gisFolderName: gisFolder.displayNameEn,
				caseReference: metadata.caseReference,
				caseId: caseData.id,
				documentCreation
			});
		} catch (error) {
			logger.error(`[GIS migration] Error processing ${gpkgFile}`, error);

			failedFiles.push({
				fileName: gpkgFile,
				documentId,
				reason: error.message
			});
		}
	}

	return {
		spreadsheet,
		skippedCount: skippedFiles.length,
		skippedFiles,
		processedCount: processedFiles.length,
		processedFiles,
		failedCount: failedFiles.length,
		failedFiles
	};
};

export const publishHistoricalBoundaries = async () => {
	const documents = await getUnpublishedGisBoundaryDocuments();

	logger.info(`[GIS migration] Found ${documents.length} GIS boundary documents to publish`);

	const readyToPublish = [];
	const failedFiles = [];

	for (const document of documents) {
		try {
			await updateDocumentVersion(document.guid, document.latestVersionId, {
				publishedStatus: DocumentPublishedStatus.READY_TO_PUBLISH
			});

			readyToPublish.push(document.guid);
		} catch (error) {
			logger.error(`[GIS migration] Failed setting READY_TO_PUBLISH for ${document.guid}`, error);

			failedFiles.push({
				documentGuid: document.guid,
				reason: error.message
			});
		}
	}

	const publishResult =
		readyToPublish.length > 0
			? await publishDocuments(readyToPublish, SYSTEM_USER_NAME)
			: { successful: [], failed: [] };

	logger.info(
		`[GIS migration] Published ${publishResult.successful.length} GIS boundary documents`
	);

	return {
		foundCount: documents.length,
		readyToPublishCount: readyToPublish.length,
		publishedCount: publishResult.successful.length,
		publishedDocuments: publishResult.successful,
		failedPublishCount: publishResult.failed.length,
		failedPublishDocuments: publishResult.failed,
		failedMetadataCount: failedFiles.length,
		failedMetadataUpdates: failedFiles
	};
};
