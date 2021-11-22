//export const validationOfficerLandingPage = () => cy.visit(`${Cypress.env('vo-url')}/appeals-list`);
export const validationOfficerLandingPage = () => cy.visit('/appeals-list');

export const validationOfficerPageTitle = () => cy.title().should('eq', "Appeal submissions for review - Appeal a householder planning decision - GOV.UK");

// table header
export const validationOfficerHeader = () => cy.get('h1');

export const tableHeaderAppealRef = () => cy.contains('Appeal reference');

export const tableHeaderReceivedOn = () => cy.contains('Received on');

export const tableHeaderAppealSite = () => cy.contains('Appeal site');

// table data
export const appealReference = (appealReferenceVO) => cy.findAllByText(appealReferenceVO);

export const appealDate = (appealReceivedDate) => cy.findAllByText(appealReceivedDate);
export const receivedOndate = () => cy.findByText('Received on');

export const appealSite = (siteAddress) => cy.findAllByText(siteAddress);




