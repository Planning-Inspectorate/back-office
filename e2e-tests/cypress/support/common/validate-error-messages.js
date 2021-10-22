import {errorMessageHeader, errorMessageLabel} from "../PageObjects/vo-review-appeal-submission-page-po";

export const validateErrorMessages = (errorMessage) => {
    cy.title().should('match', /^Error: /);
    //cy.checkPageA11y();
    errorMessageHeader().invoke('text')
        .then((text) => {
            expect(text).to.contain(errorMessage);
        });
    errorMessageLabel().invoke('text')
        .then((text) => {
            expect(text).to.contain(errorMessage);
        });
}