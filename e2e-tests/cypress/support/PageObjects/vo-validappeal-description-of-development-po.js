export const descriptionOfDevelopmentPage = () => cy.visit('/valid-appeal-details');

export const errorMessageDesDevelopment = () => cy.findByText('Enter a description of development');

export const enterDescriptionOfDevelopmentTxt = () => cy.get('[id=valid-appeal-details]').type('This is a Test Description and the appeal is considered to be Valid');

export const checkAndConfirmPageValid = () => cy.url().should('include', 'http://localhost:9004/check-and-confirm');