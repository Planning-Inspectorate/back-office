export const visitSearchPage = () => cy.visit('/search');
export const textSearchApepals = () => cy.get('.govuk-label govuk-label--m');
export const textSearchHint = () => cy.get('#event-name-hint');
export const inputSearchbox = () => cy.get('[id=searchString]');
export const appealCaseReferenceCST = (caseReferenceCST) => cy.findAllByText(caseReferenceCST);
export const appellantNameCST = (caseReferenceCST) => cy.findAllByText(caseReferenceCST);
export const appealSiteAddressCST = () => cy.get('.govuk-table');
export const appealSiteAddressBody = () => cy.get('.govuk-table__body');
