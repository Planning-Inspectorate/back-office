//export const visitMissingOrWrongPage = () => cy.visit(`${Cypress.env('vo-url')}/missing-or-wrong`);
export const visitMissingOrWrongPage = () => cy.visit('/missing-or-wrong');

export const checkNamesDoNotMatch = () => cy.get('[id=missing-or-wrong-reasons]');

export const checkSensitiveInformationIncluded = () => cy.get ('[id=missing-or-wrong-reasons-2]');

export const checkDecisionNotice = () => cy.get ('[id=missing-or-wrong-documents-2]');

export const checkGroundsOfAppeal = () => cy.get ('[id=missing-or-wrong-documents-3]');

export const checkSupportingDocuments = () => cy.get('[id=missing-or-wrong-documents-4]');

export const checkInflammatoryCommentsMade = () => cy.get ('[id=missing-or-wrong-reasons-4]');

export const checkOpenedInError = () => cy.get ('[id=missing-or-wrong-reasons-5]');

export const checkWrongAppealTypeUsed = () => cy.get ('[id=missing-or-wrong-reasons-6]');

export const checkOtherMissingOrWrong = () => cy.get ('[id=missing-or-wrong-reasons-7]');

export const textboxOtherMissingOrWrong = () => cy.get('#other-reason');



