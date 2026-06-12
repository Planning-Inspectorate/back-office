import { processHistoricalBoundaries } from './historical-gis-boundary.service.js';

export const historicalGisBoundaryMigration = async (req, res) => {
	const zipBuffer = req.body;

	if (!Buffer.isBuffer(zipBuffer) || zipBuffer.length === 0) {
		return res.status(400).json({
			error: 'Request body must contain ZIP file'
		});
	}

	const result = await processHistoricalBoundaries(zipBuffer);

	return res.status(200).json(result);
};
