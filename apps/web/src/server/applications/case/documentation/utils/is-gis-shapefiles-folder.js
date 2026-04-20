// Utility to check if a folder is the GIS Shapefiles folder
/**
 * @param {{ displayNameEn?: string }} folder
 */
export function isGisShapefilesFolder(folder) {
	if (!folder || !folder.displayNameEn) return false;
	return folder.displayNameEn.trim().toLowerCase() === 'gis shapefiles';
}
