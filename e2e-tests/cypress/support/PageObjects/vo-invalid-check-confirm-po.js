export const visitInvalidCheckConfirmPage = () => cy.visit('/check-and-confirm');

export const verifyInvalidCheckAndConfirmPage = () => cy.url().should('include', '/check-and-confirm');

export const invalidPageHeaderCheckConfirm = () => cy.get('.govuk-heading-xl').should('contain','Check and confirm');

export const invalidOutcomeOfReview = () => cy.findAllByText('Invalid').should('exist');

export const invalidReasonsTextOutOfTime = () => cy.findAllByText('Out of time').should('exist');

export const invalidReasonsTextNoRightOfAppeal = () => cy.findAllByText('No right of appeal').should('exist');

export const invalidReasonsTextNotAppealable = () => cy.findAllByText('Not appealable').should('exist');

export const invalidReasonsTextNotAppealableLPADeemedApplication = () => cy.findAllByText('LPA deemed application as invalid').should('exist');

export const invalidReasonsText = () => cy.findAllByText('Other - This is a Test data for other List Reasons why the Appeal is Invalid').should('exist');

export const warningTextCheckConfirmInValid = () => cy.get('.govuk-warning-text__text').should('contain','Confirming this appeal as invalid turns away the appeal and emails the appellant and LPA.');

export const btnConfirmAndTurnAwayAppeal = () => cy.get('.govuk-button').should('contain','Confirm and turn away appeal');




