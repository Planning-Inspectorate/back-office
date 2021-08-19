export const caseOfficerLandingPage = () => {
    return cy.visit("http://localhost:9003/appeals-list");
    cy.checkPageA11y();
};

export const caseOfficerPageTitle = () => {
       return cy.title().should('eq', "Appeal submissions for review - Appeal a householder planning decision - GOV.UK");
};
// table header
export const caseOfficerHeader = () => {
       return cy.get('h1');
};

export const tableHeaderAppealRef = () => {
        return cy.contains('Appeal reference');
};
export const tableHeaderReceivedOn = () => {
        return cy.contains('Received on');
};
export const tableHeaderAppealSite = () => {
        return cy.contains('Appeal site');
};
// table data
export const appealReference = () => {
    return cy.findAllByText( "APP/Q9999/D/21/1234567" ).should( "exist" );
};
export const appealDate = () => {
    return cy.findAllByText("16 May 2021").should("exist");
};
export const appealSite = () => {
    return cy.findAllByText("96 The Avenue, Maidstone, Kent, MD2 5XY").should("exist");
};



