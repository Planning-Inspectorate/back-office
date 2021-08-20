//Header, Footer, backLink, continue button are common for all the pages

export const headerLogo = () => cy.get('.govuk-header__logotype').should('exist');

export const appealHouseHolderLink = () => cy.contains("Appeal a householder planning decision").should('exist');

export const clickFeedBackLink = () => cy.get('[data-cy=Feedback]');

//return cy.title().should('include','Give feedback about submitting your Planning Appeal (Beta)');

export const footerGovtLicence = () => cy.get(".govuk-footer__licence-description > .govuk-footer__link");

export const backLink = () => cy.get(".govuk-back-link");

export const continueButton = () => cy.get(".govuk-button");
