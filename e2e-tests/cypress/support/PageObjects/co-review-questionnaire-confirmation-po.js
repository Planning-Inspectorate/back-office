export const questionnaireForReviewLink = () => cy.get("[data-cy=review-questionnaires]");

export const verifyPageHeading = (pageHeading) => cy.get(".govuk-panel__title")
    .should("exist")
    .should('contain', pageHeading);

export const reviewQuestionnaireListPage = () => cy.url().should('include','/questionnaires-list');

export const gotoReviewQuestionnaireConfirmationPage = () => {
    cy.visit('/review-questionnaire-complete');
};