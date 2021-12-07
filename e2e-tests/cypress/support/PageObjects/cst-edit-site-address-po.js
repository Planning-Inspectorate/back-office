export const pageTitleSiteAddress = () => cy.title().should('eq','Change address of the appeal site - Appeal a householder planning decision - GOV.UK');
export const errorPageSiteAddress = () => cy.title().should('eq',' Error: Change address of the appeal site - Appeal a householder planning decision - GOV.UK');
export const pageSiteAddress = () => cy.url().should('contain','/site-address');
export const errorSummaryTitle = () => cy.get('.govuk-error-summary__list').find('li>a').should('exist');
export const errorLabel = () => cy.get('.govuk-error-message');
export const pageHeadingSiteAddress = () => cy.get('.govuk-heading-xl');
export const errorOnLabelAddressLine1 = () => cy.get('#site-address-line-one-error');
export const errorOnLabelPostCode = () => cy.get('#site-postcode-error');

export const inputAddressLine1 = () => cy.get('#site-address-line-one');
export const inputAddressLine2 = () => cy.get('#site-address-line-two');
export const inputTownCity = () => cy.get('#site-town-city');
export const inputCounty = () => cy.get('#site-county');
export const inputPostcode = () => cy.get('#site-postcode');
export const changeLinkSiteAddress = () => cy.get('[data-cy=siteAddress]');
