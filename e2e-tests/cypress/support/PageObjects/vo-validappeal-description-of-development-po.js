export const descriptionOfDevelopmentPage = () => cy.visit('/valid-appeal-details');

export const enterDescriptionOfDevelopmentTxt = () => cy.get('[id=valid-appeal-details]').type('This is a Test Description and the appeal is considered to be Valid');

export const checkAndConfirmPageValid = () => cy.url().should('include', '/check-and-confirm');