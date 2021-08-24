export const headerReviewSubmission = () => cy.get('.govuk-heading-xl');

export const titleReviewSubmission = () => cy.title().should( 'eq', "Review appeal submission - Appeal a householder planning decision - GOV.UK");

export const reviewAppealSubmissionPage = () => cy.visit("http://localhost:9004/review-appeal-submission");

export const errorMessageHeader = () => cy.get('[id=error-summary-title]').should('exist');

export const errorMessage = () => cy.get('#review-outcome-error').should('exist');

export const appellantName = () => cy.findAllByText('Manish Sharma');

export const appealReference = () => cy.findAllByText('APP/Q9999/D/21/1234567');

export const receivedOn = () => cy.findAllByText('16 May 2021');

export const appealSite = () => cy.contains('96 The Avenue Maidstone XM26 7YS');

export const localPlanningDept = () => cy.contains('Maidstone Borough Council');

export const planningAppReference = () => cy.contains('48269/APP/2020/1482');

export const planningAppForm = () => cy.findAllByText('planning application.pdf');

export const decisionLetter = () => cy.findAllByText('decision letter.pdf');

export const appealStatement = () => cy.findAllByText('appeal statement.pdf');

export const supportingDocs = () => {
    cy.findAllByText('other documents 1.pdf');
    cy.findAllByText('other documents 2.pdf');
    cy.findAllByText('other documents 3.pdf');
};