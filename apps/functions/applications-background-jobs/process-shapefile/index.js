import { Readable } from 'node:stream';
import { blobClient } from '../common/blob-client.js';
import { notifyShapefileProcessingResult } from './src/back-office-api-client.js';
import { validateShapefileContents } from './src/validate-shapefile.js';
import { shpZipToGeoJson } from './src/convert-shapefile.js';
import { applyGeoJsonMetadata } from './src/apply-geojson-metadata.js';
import { extractBlobNameFromUri } from '../common/util.js';
import { GIS_SHAPEFILE_DOCUMENT_TYPE, DocumentPublishedStatus } from '../common/constants.js';
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
 * Azure Function triggered by the nsip-document Service Bus topic.
 * The Terraform-managed subscription `nsip-document-gis-shapefile-processor`
 * delivers all nsip-document events here; the function guards internally and
 * skips messages that are not GIS shapefiles at `not_checked` status.
 *
 * Processing steps:
 *  1. Guard: skip if documentType !== 'GIS shapefile' or publishedStatus !== 'not_checked'
 *  2. Guard: skip if any required identifiers are missing
 *  3. Download the ZIP from blob storage using documentURI
 *  4. Validate required shapefile components (.shp, .shx, .dbf) — throws ShapefileValidationError on failure
 *  5. Convert .shp to GeoJSON FeatureCollection
 *  6. Apply case metadata to the GeoJSON (project name resolved by the API from caseId)
 *  7. Upload GeoJSON to blob storage in the same directory as the ZIP
 *  8. Notify the API to create a new document version record with metadata
 *
 * On validation failure (missing shapefile components): notify the API to mark the document as 'invalid'.
 * On infrastructure failure (blob/network/parse errors): re-throw so Service Bus can retry.
 *
 * @type {import('@azure/functions').AzureFunction}
 */
export const index = async (context, documentShapefileProcess) => {
	const {
		documentId,
		caseId,
		caseRef,
		description,
		filename,
		originalFilename,
		documentURI,
		publishedStatus,
		documentType,
		dateCreated
	} = documentShapefileProcess ?? {};

	context.log(`[SHAPEFILE] Received nsip-document event for document ${documentId}`, {
		documentId,
		caseId,
		publishedStatus,
		documentType
	});

	// Only process GIS shapefiles that have just cleared the virus scan
	if (
		documentType !== GIS_SHAPEFILE_DOCUMENT_TYPE ||
		publishedStatus !== DocumentPublishedStatus.NOT_CHECKED
	) {
		context.log(
			`[SHAPEFILE] Skipping: documentType=${documentType}, publishedStatus=${publishedStatus}`
		);
		return;
	}

	if (!documentId || !caseId || !documentURI) {
		context.log.warn(`[SHAPEFILE] Missing required fields on message, skipping`, {
			documentId,
			caseId,
			documentURI
		});
		return;
	}

	context.log(`[SHAPEFILE] Processing shapefile ZIP for document ${documentId}`);

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

		// Derive GeoJSON filename from the original ZIP filename
		const baseFileName = (originalFilename ?? filename ?? documentId).replace(/\.zip$/i, '');
		const geoJsonFileName = `${baseFileName}.geojson`;

		// Note: projectName is NOT available on the nsip-document event schema.
		// The API derives it from the case record (Case.title) using caseId.
		// description here is the document-level description, not the project description.
		const receivedDate = dateCreated ? new Date(dateCreated) : new Date();
		const geoJsonWithMetadata = applyGeoJsonMetadata(geoJson, {
			caseReference: caseRef ?? '',
			projectDescription: description ?? '',
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
		// Re-throw so Service Bus retries the message. Do NOT mark as invalid — the ZIP may be fine.
		context.log.error(
			`[SHAPEFILE] Infrastructure error processing document ${documentId}: ${error.message}`
		);
		throw error;
	}
};
