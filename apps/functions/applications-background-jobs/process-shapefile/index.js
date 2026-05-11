import { Readable } from 'node:stream';
import { blobClient } from '../common/blob-client.js';
import { notifyShapefileProcessingResult } from './src/back-office-api-client.js';
import { validateShapefileContents } from './src/validate-shapefile.js';
import { shpZipToGeoJson } from './src/convert-shapefile.js';
import { validateConvertedGeoJson } from './src/validate-geojson.js';
import { applyGeoJsonMetadata } from './src/apply-geojson-metadata.js';
import { extractBlobNameFromUri } from '../common/util.js';
import config from '../common/config.js';

/**
 * Raised when a ZIP fails shapefile content validation (missing required files).
 * Distinguishes expected validation failures from unexpected infrastructure errors,
 * so the caller can decide whether to mark the document as invalid or re-throw.
 */
class ShapefileValidationError extends Error {
	/** @param {string} message */
	constructor(message) {
		super(message);
		this.name = 'ShapefileValidationError';
	}
}

/**
 * Downloads the ZIP at `blobName` from `container` and returns it as a Buffer.
 *
 * @param {string} container
 * @param {string} blobName
 * @returns {Promise<Buffer>}
 */
const downloadZipBuffer = async (container, blobName) => {
	const downloadResponse = await blobClient.downloadStream(container, blobName);
	const chunks = [];
	for await (const chunk of downloadResponse.readableStreamBody) {
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	}
	return Buffer.concat(chunks);
};

/**
 * Azure Function triggered by the `shapefile-processing-queue` Service Bus queue.
 *
 * Messages are placed on this queue by the `malware-detected` function after a virus
 * scan completes cleanly on a GIS shapefile ZIP. Because the queue is dedicated to
 * shapefile processing, no document-type or status filtering is required here.
 *
 * Message body shape (as sent by malware-detected/src/shapefile-queue.js):
 *   { documentId, caseId, caseRef, documentURI, originalFilename, dateCreated }
 *
 * Processing steps:
 *  1. Guard: skip if any required identifiers are missing (defensive — should not happen)
 *  2. Download the ZIP from blob storage using documentURI
 *  3. Validate required shapefile components (.shp, .shx, .dbf) — throws ShapefileValidationError on failure
 *  4. Convert .shp to GeoJSON FeatureCollection
 *  5. Apply case metadata to the GeoJSON
 *  6. Upload GeoJSON to blob storage alongside the source ZIP
 *  7. Notify the API to create a new document version record with the GeoJSON metadata
 *
 * On validation failure (missing shapefile components):
 *   Notify the API to mark the document as 'invalid'. Do NOT re-throw — retrying would not help.
 * On infrastructure failure (blob download, parse crash, API call, etc.):
 *   Re-throw so the Service Bus queue retries the message. Do NOT mark as invalid.
 *
 * @type {import('@azure/functions').AzureFunction}
 */
export const index = async (context, documentShapefileProcess) => {
	const { documentId, caseId, caseRef, documentURI, originalFilename, dateCreated } =
		documentShapefileProcess ?? {};

	context.log(`[SHAPEFILE] Received shapefile processing job for document ${documentId}`, {
		documentId,
		caseId
	});

	// Defensive guard: all fields must be present. Should not happen if malware-detected is correct.
	if (!documentId || !caseId || !documentURI) {
		context.log.warn(`[SHAPEFILE] Missing required fields, skipping`, {
			documentId,
			caseId,
			documentURI
		});
		return;
	}

	try {
		// Derive the private blob container and path from the documentURI
		// documentURI format: <blobStorageUrl>/<container>/<path>
		const blobName = extractBlobNameFromUri(documentURI);
		const privateBlobContainer = config.BLOB_SOURCE_CONTAINER;

		const zipBuffer = await downloadZipBuffer(privateBlobContainer, blobName);

		// Validate required shapefile components — throws ShapefileValidationError on failure
		const { valid, missingExtensions } = await validateShapefileContents(zipBuffer);

		if (!valid) {
			throw new ShapefileValidationError(
				`Missing required shapefile components: ${missingExtensions.join(', ')}`
			);
		}

		// Convert the ZIP directly to GeoJSON — shpjs handles extraction and parsing internally
		const geoJson = await shpZipToGeoJson(zipBuffer);

		const { valid: isGeoJsonValid, reason: geoJsonValidationReason } =
			validateConvertedGeoJson(geoJson);
		if (!isGeoJsonValid) {
			throw new ShapefileValidationError(
				`Converted GeoJSON failed sanity validation: ${geoJsonValidationReason}`
			);
		}

		// Derive GeoJSON filename from the original ZIP filename
		const baseFileName = (originalFilename ?? documentId).replace(/\.zip$/i, '');
		const geoJsonFileName = `${baseFileName}.geojson`;

		// Note: projectName is NOT available on the queue message.
		// The API derives it from the case record (Case.title) using caseId.
		const receivedDate = dateCreated ? new Date(dateCreated) : new Date();
		const geoJsonWithMetadata = applyGeoJsonMetadata(geoJson, {
			caseReference: caseRef ?? '',
			projectDescription: '',
			fileName: geoJsonFileName,
			receivedDate
		});

		const geoJsonBuffer = Buffer.from(JSON.stringify(geoJsonWithMetadata), 'utf8');

		// Store GeoJSON alongside the ZIP in the same blob directory
		const zipBlobDir = blobName.substring(0, blobName.lastIndexOf('/'));
		const geoJsonBlobPath = `${zipBlobDir}/${geoJsonFileName}`;

		await blobClient.uploadStream(
			privateBlobContainer,
			Readable.from(geoJsonBuffer),
			geoJsonBlobPath,
			'application/geo+json'
		);

		context.log(
			`[SHAPEFILE] Uploaded GeoJSON to ${privateBlobContainer}/${geoJsonBlobPath} (${geoJsonBuffer.length} bytes)`
		);

		// Notify the API to create the GeoJSON document version with metadata.
		// The API resolves projectName from the case record using caseId.
		await notifyShapefileProcessingResult(caseId, documentId, {
			geoJsonFileName,
			geoJsonBlobPath,
			blobContainer: privateBlobContainer,
			geoJsonSizeBytes: geoJsonBuffer.length
		});

		context.log(`[SHAPEFILE] Successfully processed shapefile for document ${documentId}`);
	} catch (error) {
		if (error instanceof ShapefileValidationError) {
			// Expected validation failure — mark the document as invalid and do NOT re-throw.
			// Retrying would not help: the content of the ZIP is fundamentally invalid.
			context.log.warn(
				`[SHAPEFILE] Validation failure for document ${documentId}: ${error.message}`
			);
			await notifyShapefileProcessingResult(caseId, documentId, { invalid: true });
			return;
		}

		// Unexpected infrastructure failure (blob download, parse crash, API call, etc.).
		// Re-throw so the Service Bus queue retries the message. Do NOT mark as invalid.
		context.log.error(
			`[SHAPEFILE] Infrastructure error processing document ${documentId}: ${error.message}`
		);
		throw error;
	}
};
