import { PassThrough } from 'node:stream';
import { blobClient } from './blob-client.js';
import config from './config.js';
import { getPublishedGisBoundaryDocuments } from './gis-boundary-api-client.js';

/**
 * @param {NodeJS.WritableStream} stream
 * @param {string} data
 * @returns {Promise<void>}
 */
export const writeAsync = (stream, data) =>
	new Promise((resolve, reject) => {
		stream.write(data, (error) => (error ? reject(error) : resolve()));
	});

/**
 * @param {unknown} geoJson
 */
export const assertValidGeoJsonFeatureCollection = (geoJson) => {
	if (!geoJson || geoJson.type !== 'FeatureCollection' || !Array.isArray(geoJson.features)) {
		throw new Error('Invalid GeoJSON FeatureCollection');
	}
};

/**
 * Downloads a project GeoJSON blob and parses it.
 * This keeps only one project boundary file in memory at a time.
 *
 * @param {string} container
 * @param {string} blobPath
 */
export const downloadProjectGeoJson = async (container, blobPath) => {
	const response = await blobClient.downloadStream(container, blobPath);

	const chunks = [];

	for await (const chunk of response.readableStreamBody) {
		chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
	}

	const geoJson = JSON.parse(Buffer.concat(chunks).toString('utf8'));

	assertValidGeoJsonFeatureCollection(geoJson);

	return geoJson;
};

const MASTER_GEOJSON_BLOB_PATH = 'gis-boundaries/all-project-boundaries.geojson';

/**
 * Streams all currently published GIS boundaries into one master GeoJSON blob.
 *
 * Possible race condition however it would be uncommon for more than one document
 * of this type to be published a week
 *
 * @param {import('@azure/functions').Logger} log
 * @returns {Promise<void>}
 */
export const rebuildMasterGeoJson = async (log) => {
	log.info('[MASTER_GEOJSON] Rebuilding master GeoJSON');

	const publishedDocuments = await getPublishedGisBoundaryDocuments();

	const stream = new PassThrough();

	const uploadPromise = blobClient.uploadStream(
		config.BLOB_PUBLISH_CONTAINER,
		stream,
		MASTER_GEOJSON_BLOB_PATH,
		'application/geo+json'
	);

	await writeAsync(stream, '{"type":"FeatureCollection","features":[');

	let isFirstFeature = true;

	for (const document of publishedDocuments) {
		log.info(
			`[MASTER_GEOJSON] Adding boundary for ${document.caseReference} from ${document.publishedBlobContainer}/${document.publishedBlobPath}`
		);

		const projectGeoJson = await downloadProjectGeoJson(
			document.publishedBlobContainer,
			document.publishedBlobPath
		);

		for (const feature of projectGeoJson.features) {
			if (!isFirstFeature) {
				await writeAsync(stream, ',');
			}

			await writeAsync(stream, JSON.stringify(feature));

			isFirstFeature = false;
		}
	}

	await writeAsync(stream, ']}');

	stream.end();

	await uploadPromise;

	log.info(
		`[MASTER_GEOJSON] Master GeoJSON rebuilt at ${config.BLOB_PUBLISH_CONTAINER}/${MASTER_GEOJSON_BLOB_PATH}`
	);
};
