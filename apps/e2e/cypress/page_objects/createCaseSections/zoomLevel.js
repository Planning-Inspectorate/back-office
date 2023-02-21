// @ts-nocheck
import { ZOOM_LEVELS } from '../../support/utils/options';
import { SectionBase } from './sectionBase';

export class ZoomLevelSection extends SectionBase {
	getZoomLevelIndex(zoomLevel) {
		let options = ZOOM_LEVELS;
		return options.indexOf(zoomLevel);
	}

	chooseZoomLevel(zoomLevel) {
		this.chooseRadioBtnByIndex(this.getZoomLevelIndex(zoomLevel));
	}

	validatePage() {
		this.validateSectionHeader('Choose map zoom level');
	}
}
