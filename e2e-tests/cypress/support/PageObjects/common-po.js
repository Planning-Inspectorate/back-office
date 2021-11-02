//Header, Footer, backLink, continue button are common for all the pages

export const headerLogo = () => cy.get('.govuk-header__logotype').should('exist');

export const appealHouseHolderLink = () => cy.contains("Appeal a householder planning decision").should('exist');

export const clickFeedBackLink = () => cy.get('[data-cy=Feedback]');

export const footerGovtLicence = () => cy.get(".govuk-footer__licence-description > .govuk-footer__link");

export const backLink = () => cy.get(".govuk-back-link");

export const continueButton = () => cy.get(".govuk-button");

export const pageHeading = () =>cy.get('h1');

export const linkChangeOutcome = () => cy.get('.govuk-link').contains('Change outcome');
