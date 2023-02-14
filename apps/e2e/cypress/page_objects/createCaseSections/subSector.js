// @ts-nocheck
import { SUBSECTORS } from '../../support/utils/options';
import { SectionBase } from './sectionBase';

export class SubSectorSection extends SectionBase {
	getSubsectorIndex(subsectorName) {
		let options = SUBSECTORS;
		let index = options.indexOf(subsectorName);
		return { optionName: subsectorName, index };
	}

	chooseSubsector(subsectorName) {
		this.chooseRadioBtnByIndex(this.getSubsectorIndex(subsectorName).index + 1);
	}

	validatePage() {
		this.validateSectionHeader('Choose a subsector');
	}
}
