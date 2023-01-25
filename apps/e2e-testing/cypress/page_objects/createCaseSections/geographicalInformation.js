// @ts-nocheck
import { SectionBase } from './sectionBase';

export class GeographicalInformationSection extends SectionBase {
	elements = {
		location: () => cy.get('#geographicalInformation\\.locationDescription'),
		easting: () => cy.get('#geographicalInformation\\.gridReference\\.easting'),
		northing: () => cy.get('#geographicalInformation\\.gridReference\\.northing')
	};

	fillEastingGridRef(gridRef) {
		this.elements.easting().clear().type(gridRef);
	}

	fillLocation(location) {
		this.elements.location().clear().type(location);
	}

	fillNorthingGridRef(gridRef) {
		this.elements.northing().clear().type(gridRef);
	}

	validatePage() {
		this.validateSectionHeader('Enter geographical information');
	}
}
