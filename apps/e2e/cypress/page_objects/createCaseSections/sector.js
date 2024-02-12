// @ts-nocheck
import { SECTORS } from '../../support/utils/options';
import { SectionBase } from './sectionBase';

export class SectorSection extends SectionBase {
	getSectorIndex(sectorName) {
		let options = SECTORS;
		return options.indexOf(sectorName);
	}

	chooseSector(sectorName) {
		this.chooseRadioBtnByIndex(this.getSectorIndex(sectorName));
	}

	validatePage() {
		this.validateSectionHeader('Choose a sector');
	}
	validatePage() {
		this.validateSectionHeader('Choose a sector');
	}
	selectTrainingAsSectorSubsector(){
		cy.get('#sectorName-7').click();
		cy.get('.govuk-button').click();
		cy.get('#subSectorName').click();
		cy.get('.govuk-button').click();
	}
}
