import BackOfficeAppError from '#utils/app-error.js';
import logger from '#utils/logger.js';
import {
	createGeoJsonDocumentVersion,
	markDocumentAsInvalid,
	isDocumentInGisShapefilesFolder
} from './shapefile-processing.service.js';

/**
 * Body (success): { geoJsonFileName, geoJsonBlobPath, blobContainer, geoJsonSizeBytes }
 * Body (failure): { invalid: true }
 *
 * @type {import('express').RequestHandler<{guid: string}, any, any, any>}
 */
export const processShapefile = async ({ params, body }, response) => {
	const { guid: documentGuid } = params;

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
			'Missing one or more required fields: geoJsonFileName, geoJsonBlobPath, blobContainer, geoJsonSizeBytes',
			400
		);
	}

	await createGeoJsonDocumentVersion({
		documentGuid,
		geoJsonFileName,
		geoJsonBlobPath,
		blobContainer,
		geoJsonSizeBytes
	});

	response.status(200).send({ status: 'processed' });
};
