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
		// Debug: Check if we're on the right page
		cy.get('body').then(($body) => {
			cy.log('Current page body HTML snippet: ' + $body.html().substring(0, 500));
		});

		// Debug: List all form inputs on the page
		cy.get('input').then(($inputs) => {
			const inputIds = $inputs.map((i, el) => el.id).get();
			cy.log('Available input IDs: ' + inputIds.join(', '));
		});

		this.elements.location().clear().type(location);
	}

	fillNorthingGridRef(gridRef) {
		this.elements.northing().clear().type(gridRef);
	}

	validatePage() {
		this.validateSectionHeader('Enter geographical information');
	}
}
