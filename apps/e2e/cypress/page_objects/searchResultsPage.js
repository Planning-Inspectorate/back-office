// @ts-nocheck
import { Page } from './basePage';

export class SearchResultsPage extends Page {
	elements = {
		searchResults: () => cy.get(this.selectors.smallHeader),
		searchApplicationsError: () => cy.get('#searchApplications-error')
	};

	// U S E R  A C T I O N S
	clickTopSearchResult() {
		this.basePageElements.tableRow().eq(1).find(this.selectors.body).click();
	}

	// A S S E R T I O N S
	verifySearchError(errorText) {
		this.elements.searchApplicationsError().should('be.visible').and('include.text', errorText);
	}

	verifySearchResultsCount(matchCount = 0) {
		this.elements.searchResults().as('result');
		if (matchCount > 0) {
			cy.get('@result').should('contain.text', `${matchCount}\n\t\t\tresults\n\t\t`);
			this.basePageElements.tableRow().should('have.length', parseInt(matchCount) + 1);
		} else {
			cy.get('@result').should('be.visible');
			this.basePageElements.tableRow().its('length').should('be.greaterThan', 2);
		}
	}

	verifyTopSearchResultName(caseName) {
		this.basePageElements
			.tableRow()
			.eq(1)
			.find(this.selectors.body)
			.should('have.text', `\n\t\t${caseName}\n\t`);
	}
}
