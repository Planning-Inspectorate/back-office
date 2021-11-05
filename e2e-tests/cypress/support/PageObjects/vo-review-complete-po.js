//export const visitPageUrl = () => cy.visit('/review-complete');
export const visitReviewCompleteValid = () => cy.url().should('include','/review-complete');
export const visitReviewCompleteInValid = () => cy.url().should('include','/review-complete');
export const visitReviewCompleteMissingWrong = () => cy.url().should('include','/review-complete');


// Valid Page Objects
export const verifyAppealValid = () => cy.get('.govuk-panel__body');
export const verifyAppealReference = () => cy.findByText('APP/Q9999/D/21/1234567');
export const textAppealStart = () => cy.findByText('The appeal has been started and the LPA questionnaire email has been sent.');

//Invalid Page Objects
export const verifyAppealInValid = () => cy.get('.govuk-panel__body');
export const verifyInvalidAppealReference = () => cy.findByText('APP/Q9999/D/21/1234567');
export const textAppealTurnedAway = () => cy.findByText('The appeal has been turned away, and emails have been sent to the appellant and LPA.');

//Something missing or wrong Page Objects
export const verifyAppealMissingWrong = () => cy.get('.govuk-panel__body');
export const verifyMissingAppealReference = () => cy.findByText('APP/Q9999/D/21/1234567');
