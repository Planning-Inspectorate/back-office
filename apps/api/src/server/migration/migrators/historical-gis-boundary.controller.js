import {
	processHistoricalBoundaries,
	publishHistoricalBoundaries
} from './historical-gis-boundary.service.js';

export const historicalGisBoundaryMigrationInsert = async (req, res) => {
	const zipBuffer = req.body;

	if (!Buffer.isBuffer(zipBuffer) || zipBuffer.length === 0) {
		return res.status(400).json({
			error: 'Request body must contain ZIP file'
		});
	}

	const result = await processHistoricalBoundaries(zipBuffer);

	return res.status(200).json(result);
};

export const historicalGisBoundaryMigrationPublish = async (req, res) => {
	const result = await publishHistoricalBoundaries();

	return res.status(200).json(result);
};
