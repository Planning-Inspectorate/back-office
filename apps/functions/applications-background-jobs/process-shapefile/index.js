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
 * Azure Function triggered by the nsip-document Service Bus topic.
 * Subscription filter (configured in Terraform) ensures only messages where
 * documentType = 'GIS shapefile' are delivered to this function.
 *
 * Processing steps:
 *  1. Guard: skip if publishedStatus is not 'not_checked' (virus scan not yet complete)
 *  2. Download the ZIP from blob storage using documentURI
 *  3. Extract and validate required shapefile components (.shp, .shx, .dbf)
 *  4. Convert .shp to GeoJSON FeatureCollection
 *  5. Apply case metadata to the GeoJSON
 *  6. Upload GeoJSON to blob storage in the same folder as the ZIP
 *  7. Notify the API to create a new document version record with metadata
 *
 * On validation failure: notify the API to mark the document as 'invalid'.
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
		dateCreated,
		filter1
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

		// Download the ZIP
		const downloadResponse = await blobClient.downloadStream(privateBlobContainer, blobName);
		const chunks = [];
		for await (const chunk of downloadResponse.readableStreamBody) {
			chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
		}
		const zipBuffer = Buffer.concat(chunks);

		// Validate required shapefile components before attempting conversion
		const { valid, missingExtensions } = await validateShapefileContents(zipBuffer);

		if (!valid) {
			context.log.warn(
				`[SHAPEFILE] Invalid ZIP for document ${documentId}: missing ${missingExtensions.join(
					', '
				)}`
			);
			await notifyShapefileProcessingResult(caseId, documentId, { invalid: true });
			return;
		}

		// Convert the ZIP directly to GeoJSON — shpjs handles extraction and parsing internally
		const geoJson = await shpZipToGeoJson(zipBuffer);

		// Derive GeoJSON filename from the original ZIP filename
		const baseFileName = (originalFilename ?? filename ?? documentId).replace(/\.zip$/i, '');
		const geoJsonFileName = `${baseFileName}.geojson`;

		// Apply case metadata as top-level GeoJSON properties
		const receivedDate = dateCreated ? new Date(dateCreated) : new Date();
		const geoJsonWithMetadata = applyGeoJsonMetadata(geoJson, {
			caseReference: caseRef ?? '',
			projectName: filter1 ?? '',
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

		// Notify the API to create the GeoJSON document version with metadata
		await notifyShapefileProcessingResult(caseId, documentId, {
			geoJsonFileName,
			geoJsonBlobPath,
			blobContainer: privateBlobContainer,
			geoJsonSizeBytes: geoJsonBuffer.length
		});

		context.log(`[SHAPEFILE] Successfully processed shapefile for document ${documentId}`);
	} catch (error) {
		context.log.error(
			`[SHAPEFILE] Unhandled error processing document ${documentId}: ${error.message}`
		);
		await notifyShapefileProcessingResult(caseId, documentId, { invalid: true });
		throw error;
	}
};
