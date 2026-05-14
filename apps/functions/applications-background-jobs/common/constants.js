export const GIS_SHAPEFILE_DOCUMENT_TYPE = 'GIS shapefile';
export const SHAPEFILE_REQUIRED_EXTENSIONS = ['.shp', '.shx', '.dbf'];

export const DocumentPublishedStatus = {
	NOT_CHECKED: 'not_checked',
	INVALID: 'invalid'
};

export const GEOJSON_ENQUEUE_REASON = {
	SCAN_NOT_CLEAN: 'scan_not_clean',
	NOT_GIS_SHAPEFILE: 'not_gis_shapefile',
	NO_DOCUMENT_URI: 'no_document_uri',
	SOURCE_NOT_ZIP: 'source_not_zip',
	GEOJSON_EVENT_LOOP_GUARD: 'geojson_event_loop_guard'
};

export const SHAPEFILE_SOURCE_ZIP_FILE_REGEX = /\.zip$/i;
export const GEOJSON_FILE_REGEX = /\.geojson($|\?)/i;
