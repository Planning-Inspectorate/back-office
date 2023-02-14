// @ts-nocheck
import { SECTORS } from '../../support/utils/options';
import { SectionBase } from './sectionBase';

export class SectorSection extends SectionBase {
	getSectorIndex(sectorName) {
		let options = SECTORS;
		let index = options.indexOf(sectorName);
		return { optionName: sectorName, index: index };
	}

	chooseSector(sectorName) {
		this.chooseRadioBtnByIndex(this.getSectorIndex(sectorName).index + 1);
	}

	validatePage() {
		this.validateSectionHeader('Choose a sector');
	}
	validatePage() {
		this.validateSectionHeader('Choose a sector');
	}
}
