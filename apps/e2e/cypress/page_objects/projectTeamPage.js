// @ts-nocheck
import { Page } from './basePage';
export class ProjectTeamPage extends Page {

	elements = {
		addTeamMember: () => cy.get('a[class="govuk-button govuk-!-margin-top-6"]'),
		searchTeamMember: () => cy.get('#query'),
		searchTeamMemberButton: () => cy.get('.govuk-button'),
		invalidSearchResults: () => cy.get('p[class="govuk-body font-weight--700"]'),
		searchResultsWithOutinput: () => cy.get('#query-error'),
		actionAdded: () => cy.get('td.govuk-table__cell:nth-child(3)'),
		actionSelect: () => cy.get('a.govuk-link:nth-child(1)'),
		selectRole: () => cy.get('#role'),
		saveAndReturn: () => cy.get('button.govuk-button:nth-child(2)'),
		caseManager: () => cy.get('td.govuk-table__cell:nth-child(1) > strong:nth-child(1)'),
		validateInvalidSearchResults: () => cy.get('h2.govuk-body'),
		invalidSearchCount: () => cy.get('p.govuk-body:nth-child(3)'),
		errorMessageForSearch: () => cy.get('#query-error')
	};

	searchTeamMemberByEmail(email) {
		this.elements.searchTeamMember().type(email);
		this.elements.searchTeamMemberButton().click();
	}
	verifyTeamMemberIsAdded() {
		this.elements.actionAdded().contains('Added');
	}
	addTeamMeber(email) {
		this.elements.searchTeamMember().type(email);
		this.elements.searchTeamMemberButton().click();
		this.elements.actionSelect().click();
		this.elements.selectRole().click();
		this.elements.saveAndReturn().click();

	}
	verifyCaseManagerRoleAdded() {
		this.elements.caseManager().contains('Case Manager');
	}
	verifyInvalidSearchResultsMessageAndCount() {
		this.elements.validateInvalidSearchResults().contains('There are no matching results');
		this.elements.invalidSearchCount().contains('0 results');
	}
	validateMultipleSearchCount() {
		cy.get('.govuk-body').then((list) => {
		cy.log(list.length);
		expect(list).to.not.equal(0);
		})
	}
	validateErrorMessageWithoutEnteringAnything() {
		this.elements.searchTeamMemberButton().click();
		this.elements.errorMessageForSearch().contains('Enter a search term');
	}


}
