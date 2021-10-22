export const headerReviewSubmission = () => cy.get('.govuk-heading-xl');

export const titleReviewSubmission = () => cy.title().should( 'eq', "Review appeal submission - Appeal a householder planning decision - GOV.UK");

export const visitReviewAppealSubmissionPage = () => cy.visit('/review-appeal-submission/db9cc77a-7991-42e5-a917-0fc73e4ccd49');

export const reviewAppealSubmissionPage = () => cy.url().should('include','/review-appeal-submission/db9cc77a-7991-42e5-a917-0fc73e4ccd49');

export const selectOutcomeValid = () => cy.findAllByText('Valid');

export const selectOutcomeInvalid = () => cy.findAllByText('Invalid');

export const selectOutcomeMissingOrWrong = () => cy.findAllByText('Something is missing or wrong');

//export const errorMessageHeader = () => cy.get('a[href="#valid-appeal-details"]').should('exist');
export const errorMessageHeader = () => cy.get('.govuk-error-summary__list').find('li>a').should('exist');

export const errorMessageLabel = () => cy.get('.govuk-error-message').should('exist');

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
