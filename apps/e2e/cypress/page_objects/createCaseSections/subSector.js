// @ts-nocheck
import { SUBSECTORS } from '../../support/utils/options';
import { SectionBase } from './sectionBase';

export class SubSectorSection extends SectionBase {
	getSubsectorIndex(sectorName, subsectorName) {
		let subsectors = SUBSECTORS[sectorName];
		return subsectors.indexOf(subsectorName);
	}

	chooseSubsector(sectorName, subsectorName) {
		const index = this.getSubsectorIndex(sectorName, subsectorName);
		this.chooseRadioBtnByIndex(index);
	}

	validatePage() {
		this.validateSectionHeader('Choose a subsector');
	}
}
