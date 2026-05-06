import BackOfficeAppError from '#utils/app-error.js';
import logger from '#utils/logger.js';
import {
	createGeoJsonDocumentVersion,
	markDocumentAsInvalid,
	isDocumentInGisShapefilesFolder
} from './shapefile-processing.service.js';

/**
 * POST /applications/:id/documents/:guid/process-shapefile
 *
 * Called by the Azure Function after it has:
 *  1. Validated the ZIP contents
 *  2. Converted the shapefile to GeoJSON
 *  3. Uploaded the GeoJSON to blob storage
 *
 * Body (success path):
 *  { geoJsonFileName, geoJsonBlobPath, blobContainer, geoJsonSizeBytes }
 *
 * Body (failure path):
 *  { invalid: true }
 *
 * @type {import('express').RequestHandler<{id: string; guid: string}, any, any, any>}
 */
export const processShapefile = async ({ params, body }, response) => {
	const { id: caseId, guid: documentGuid } = params;

	const inGisFolder = await isDocumentInGisShapefilesFolder(documentGuid);
	if (!inGisFolder) {
		throw new BackOfficeAppError(`Document ${documentGuid} is not in GIS Shapefiles folder`, 400);
	}

	if (body.invalid) {
		logger.info(`[SHAPEFILE] Marking document ${documentGuid} as invalid`);
		await markDocumentAsInvalid(documentGuid);
		response.status(200).send({ status: 'invalid' });
		return;
	}

	const { geoJsonFileName, geoJsonBlobPath, blobContainer, geoJsonSizeBytes } = body;

	if (!geoJsonFileName || !geoJsonBlobPath || !blobContainer || geoJsonSizeBytes == null) {
		throw new BackOfficeAppError(
			'Missing required fields: geoJsonFileName, geoJsonBlobPath, blobContainer, geoJsonSizeBytes',
			400
		);
	}

	await createGeoJsonDocumentVersion({
		documentGuid,
		caseId: Number(caseId),
		geoJsonFileName,
		geoJsonBlobPath,
		blobContainer,
		geoJsonSizeBytes
	});

	response.status(200).send({ status: 'processed' });
};
