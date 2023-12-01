// @ts-nocheck
import { Page } from './basePage';

export class SearchResultsPage extends Page {
	elements = {
		searchResults: () => cy.get(this.selectors.smallHeader),
		searchApplicationsError: () => cy.get('#searchApplications-error'),
		searchResultsCount: () => cy.get('#main-content > div:nth-child(3) > p'),
		searchResultsTableCount: () => cy.get('#main-content > div:nth-child(3) > table'),
		invalidSearchCount: () => cy.get('#main-content > div:nth-child(3) > p:nth-child(1)'),
		verifyViewLink: () => cy.get('tbody tr:nth-child(1) td:nth-child(3) a:nth-child(1)')

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
			.should('contain.text', caseName);
	}
	verifyDocumentSearchResults(documentName){
		cy.get('#searchDocuments').type(documentName);
	}
	verifyDocumentsCount(){
      	this.elements.searchResultsTableCount().should('have.length.greaterThan',0);
	}
	verifyInvalidSearchResultsCount(){
		this.elements.invalidSearchCount().contains('0 results');
	}
	clickDocumentViewLink(){
		this.elements.verifyViewLink().click();
	}
}
