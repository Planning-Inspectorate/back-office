//export const descriptionOfDevelopmentPage = () => cy.visit(`${Cypress.env('vo-url')}/valid-appeal-details`);
export const descriptionOfDevelopmentPage = () => cy.visit('/valid-appeal-details');

export const enterDescriptionOfDevelopmentTxt = () => cy.get('[id=valid-appeal-details]');

export const checkAndConfirmPageValid = () => cy.url().should('include', '/check-and-confirm');