export const visitMissingOrWrongCheckConfirmPage = () => cy.visit('/check-and-confirm');

export const verifyOutcomeOfReview = () => cy.findByText('Outcome of review');

export const verifyAppellantName = () => cy.findByText('Appellant name');

export const  verifyAppealReference= () => cy.findByText('Appeal reference');

export const  verifyAppealSite = () => cy.findByText('Appeal site');

export const  verifyMissingWrongReasons = () => cy.findByText('Reasons');

export const textNamesDoNotMatch = () => cy.findByText('Names do not match');

export const textOtherReason = () =>  cy.findByText('Reasons');

export const verifyCheckBoxTasksEmails = () => cy.get('.govuk-label');

export const btnConfirmFinishReview = () => cy.get('.govuk-button');
