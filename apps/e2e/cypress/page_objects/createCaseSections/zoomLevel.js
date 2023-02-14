// @ts-nocheck
import { ZOOM_LEVELS } from '../../support/utils/options';
import { SectionBase } from './sectionBase';

export class ZoomLevelSection extends SectionBase {
	getZoomLevelIndex(zoomLevel) {
		let options = ZOOM_LEVELS;
		let index = options.indexOf(zoomLevel);
		return { optionName: zoomLevel, index: index };
	}

	chooseZoomLevel(zoomLevel) {
		this.chooseRadioBtnByIndex(this.getZoomLevelIndex(zoomLevel).index + 1);
	}

	validatePage() {
		this.validateSectionHeader('Choose map zoom level');
	}
}
