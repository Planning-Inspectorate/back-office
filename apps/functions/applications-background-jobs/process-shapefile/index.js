import { Readable } from 'node:stream';
import { blobClient } from '../common/blob-client.js';
import { getProjectName, notifyShapefileProcessingResult } from './src/back-office-api-client.js';
import { validateShapefileContents } from './src/validate-shapefile.js';
import { shpZipToGeoJson } from './src/convert-shapefile.js';
import { validateConvertedGeoJson } from './src/validate-geojson.js';
import { applyGeoJsonMetadata } from './src/apply-geojson-metadata.js';
import { downloadZipBuffer } from './src/download-zip.js';
import { ShapefileValidationError } from './src/errors.js';

/**
 * Convert incoming `dateCreated` to a safe Date.
 *
 * This flow receives unix seconds from `/applications/documents/:guid/properties`.
 * `new Date(seconds)` is wrong (treated as milliseconds) and produces 1970 dates,
 * so we convert seconds to milliseconds first.
 *
 * Also accepts Date/ISO/numeric-string values defensively and falls back to `new Date()`.
 *
 * TODO(IDAS-662): replace with Temporal when available in this runtime.
 *
 * @param {unknown} dateCreated
 * @returns {Date}
 */
const normalizeReceivedDate = (dateCreated) => {
	if (dateCreated instanceof Date && !Number.isNaN(dateCreated.getTime())) {
		return dateCreated;
	}

	if (typeof dateCreated === 'number' && Number.isFinite(dateCreated)) {
		// Heuristic: values below 1e12 are unix seconds; Date expects milliseconds.
		const ms = dateCreated < 1_000_000_000_000 ? dateCreated * 1000 : dateCreated;
		const parsed = new Date(ms);
		return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
	}

	if (typeof dateCreated === 'string') {
		const trimmed = dateCreated.trim();
		if (!trimmed) {
			return new Date();
		}

		const asNumber = Number(trimmed);
		if (Number.isFinite(asNumber)) {
			// Numeric strings may be epoch seconds/milliseconds from API payloads.
			const ms = asNumber < 1_000_000_000_000 ? asNumber * 1000 : asNumber;
			const parsedFromNumber = new Date(ms);
			return Number.isNaN(parsedFromNumber.getTime()) ? new Date() : parsedFromNumber;
		}

		const parsedFromString = new Date(trimmed);
		return Number.isNaN(parsedFromString.getTime()) ? new Date() : parsedFromString;
	}

	return new Date();
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
	const {
		documentId,
		caseId,
		caseRef,
		privateBlobContainer,
		privateBlobPath,
		originalFilename,
		dateCreated
	} = documentShapefileProcess ?? {};
	const normalizedCaseRef = typeof caseRef === 'string' ? caseRef.trim() : '';

	context.log(`[SHAPEFILE] Received shapefile processing job for document ${documentId}`, {
		documentId,
		privateBlobContainer,
		privateBlobPath,
		originalFilename
	});

	// Defensive guard: all fields must be present. Should not happen if malware-detected is correct.
	if (!documentId || !caseId || !privateBlobContainer || !privateBlobPath || !normalizedCaseRef) {
		context.log.warn(`[SHAPEFILE] Missing one or more of the required fields, skipping`, {
			documentId,
			caseId,
			caseRef,
			privateBlobContainer,
			privateBlobPath
		});
		return;
	}

	try {
		// Use blob container and path directly from the queue message
		const blobName = privateBlobPath.replace(/^\/+/, '');

		context.log(`[SHAPEFILE] Blob details`, {
			privateBlobContainer,
			blobName
		});

		const zipBuffer = await downloadZipBuffer(privateBlobContainer, blobName, context);

		// Validate required shapefile components — throws ShapefileValidationError on failure
		const { valid, missingExtensions, fileNames, parseError } = await validateShapefileContents(
			zipBuffer
		);

		if (!valid) {
			if (fileNames.length > 0) {
				context.log.warn(`[SHAPEFILE] Files found in ZIP: ${fileNames.join(', ')}`);
			}
			if (parseError) {
				context.log.warn(`[SHAPEFILE] ZIP parse failed for document ${documentId}: ${parseError}`);
			}
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
		const projectName = await getProjectName(caseId);

		const receivedDate = normalizeReceivedDate(dateCreated);
		const geoJsonWithMetadata = applyGeoJsonMetadata(geoJson, {
			caseReference: normalizedCaseRef,
			projectName,
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
		await notifyShapefileProcessingResult(documentId, {
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
			await notifyShapefileProcessingResult(documentId, { invalid: true });
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
