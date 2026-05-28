export const SHAPEFILE_REQUIRED_EXTENSIONS = ['.shp', '.shx', '.dbf'];

export const GIS_SHAPEFILE_FILTER = 'GIS shapefile';
export const GIS_SHAPEFILES_FOLDER_NAME = 'GIS Shapefiles';

// Phase 2 upsert in document.service.js overwrites documentType to null.
// When that is fixed, change this to 'GIS shapefile'.
export const GIS_DOCUMENT_TYPE = null;

export const GIS_ZIP_MIME_TYPES = ['application/zip', 'application/x-zip-compressed'];

export const SHAPEFILE_PROCESSING_QUEUE = 'shapefile-processing-queue';

export const DocumentPublishedStatus = {
	NOT_CHECKED: 'not_checked',
	FAILED_VIRUS_CHECK: 'failed_virus_check'
};
