export const pageHeader = () => cy.get('.govuk-heading-xl').should('contain','Check and confirm');

export const visitCheckConfirmPageValid = () => cy.visit('/check-and-confirm');

export const warningTextCheckConfirmValid = () => cy.get('.govuk-warning-text__text').should('contain','Confirming this appeal as valid starts the appeal and sends the LPA questionnaire email.');

export const btnConfirmAndStartAppeal = () => cy.get('.govuk-button').should('contain',' Confirm and start appeal');

export const pageTitleValidCheckConfirm = () => cy.title().should('include','Check and confirm - Appeal a householder planning decision - GOV.UK');

export const outcomeOfReview = () => cy.findAllByText('Valid').should('exist');
export const outcomeOfReviewLabel = () => cy.findByText('Outcome of review');
export const verifyDescriptionOfDevelopmentText = () => cy.findAllByText('Description of');
