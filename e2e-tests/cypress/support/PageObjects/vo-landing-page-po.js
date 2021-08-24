export const caseOfficerLandingPage = () => cy.visit("http://localhost:9004/appeals-list");

export const caseOfficerPageTitle = () => cy.title().should('eq', "Appeal submissions for review - Appeal a householder planning decision - GOV.UK");

// table header
export const caseOfficerHeader = () => cy.get('h1');

export const tableHeaderAppealRef = () => cy.contains('Appeal reference');

export const tableHeaderReceivedOn = () => cy.contains('Received on');

export const tableHeaderAppealSite = () => cy.contains('Appeal site');

// table data
export const appealReference = () => cy.findAllByText( "APP/Q9999/D/21/1234567" ).should( "exist" );

export const appealDate = () => cy.findAllByText("16 May 2021").should("exist");

export const appealSite = () => cy.findAllByText("96 The Avenue, Maidstone, Kent, MD2 5XY").should("exist");




