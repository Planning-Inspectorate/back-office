export const headerReviewSubmission = () => cy.get('.govuk-heading-xl');
export const titleReviewSubmission = () => cy.title().should( 'eq', "Review appeal submission - Appeal a householder planning decision - GOV.UK");
export const visitReviewAppealSubmissionPage = () => cy.visit('/review-appeal-submission/6ff8d0ef-3767-4258-b3d3-34d48fca238b');
//export const visitReviewAppealSubmissionPage = () => cy.visit(`${Cypress.env('vo-url')}/review-appeal-submission/db9cc77a-7991-42e5-a917-0fc73e4ccd49`);
export const reviewAppealSubmissionPage = () => cy.url().should('include','/review-appeal-submission/');
export const selectOutcomeValid = () => cy.findAllByText('Valid');
export const selectOutcomeInvalid = () => cy.findAllByText('Invalid');
export const selectOutcomeMissingOrWrong = () => cy.findAllByText('Something is missing or wrong');
export const errorMessageHeader = () => cy.get('.govuk-error-summary__list').find('li>a').should('exist');
//export const errorMessageHeader = () =>cy.get('[id=error-summary-title]').should('exist');
export const errorMessageLabel = () => cy.get('.govuk-error-message').should('exist');
export const appellantName = (appealReferenceVO) => cy.findAllByText(appealReferenceVO);
export const receivedOn = () => cy.findAllByText('Received on');
export const appealSite = () => cy.findAllByText('Appeal site');
export const localPlanningDept = () => cy.findAllByText('Local planning department');
export const planningAppReference = () => cy.findAllByText('Planning application reference');
export const planningAppForm = () => cy.findByText('Planning application form');
export const decisionLetter = () => cy.findAllByText('Decision letter');
export const appealStatement = () => cy.findAllByText('Appeal statement');
export const supportingDocs = () =>  cy.findAllByText('Supporting documents');


