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

export const planningAppForm = () => {
    const planningApplication = cy.findAllByText('planning application.pdf');
    cy.downloadFile('http://localhost:9004/review-appeal-submission/0054f2b4-e70c-4dca-9f87-cab26c6dabb3','e2e-tests/cypress/fixtures/Download', 'planApp');
    cy.readFile('cypress/fixtures/Download/planning application.pdf').should('contain', 'I want to build a conservatory on my house');

}

// export const decisionLetter = () => {
//     //cy.findAllByText('decision letter.pd
//     f');
//     const decisionLetter = cy.findAllByText('decision letter.pdf');
//     cy.downloadFile('','cypress/fixtures/Download', 'decisionLetter');
//     cy.readFile('cypress/fixtures/Download/decision letter.pdf').should('contain', 'Lorem ipsum dolor sit amet');
// }

// export const appealStatement = () => {
//     //cy.findAllByText('appeal statement.pdf');
//     const appealStatement = cy.findAllByText('appeal statement.pdf');
//     cy.downloadFile('','cypress/fixtures/Download', 'appealStatement');
//     cy.readFile('cypress/fixtures/Download/appeal statement.pdf').should('contain', 'Lorem ipsum dolor sit amet');
// }
//
// export const supportingDocs = () => {
//     //cy.findAllByText('other documents 1.pdf');
//     const otherDocuments1 = cy.findAllByText('other documents 1.pdf');
//     cy.downloadFile('','cypress/fixtures/Download', 'otherDocuments1');
//     cy.readFile('cypress/fixtures/Download/other documents 1.pdf').should('contain', 'Lorem ipsum dolor sit amet');
//
//     //cy.findAllByText('other documents 2.pdf');
//     //cy.findAllByText('other documents 3.pdf');
// };