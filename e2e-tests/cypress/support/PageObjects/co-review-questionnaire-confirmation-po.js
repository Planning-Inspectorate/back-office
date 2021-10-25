export const questionnaireForReviewLink = () => cy.get("[data-cy=review-questionnaires]");

export const reviewQuestionnaireConfirmationPage = () => cy.url().should('include','/review-questionnaire-complete');

export const reviewQuestionnaireListPage = () => cy.url().should('include','/questionnaires-list');

export const gotoReviewQuestionnaireConfirmationPage = () => {
    cy.visit('/review-questionnaire-complete');
};