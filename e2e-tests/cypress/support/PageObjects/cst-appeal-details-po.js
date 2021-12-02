export const visitAppealDetailsPage = () => cy.visit('/appeal-details');
export const viewAppealDetailsPage = () => cy.url();
export const pageAppealDetailsTitle = () => cy.title().should('eq', 'Search results - Appeal a householder planning decision - GOV.UK');
export const viewAppealSiteAddress = () => cy.get('.govuk-summary-list');
export const sectionSummary = () => cy.get('#summary');
export const localPlanningDepartment = () => cy.get('.govuk-summary-list');
export const viewTextCaseFile = () => cy.get('#case-file');
export const viewTextKeyDates = () => cy.get('#key-dates');
export const applicationDecisionDate = () => cy.findAllByText('Application decision date');
export const appealSubmissiondate = () => cy.findAllByText('Appeal submission date');
export const validationDate = () => cy.findAllByText('Validation date');
export const validDate = () => cy.findAllByText('Valid date');
export const viewTextContactDetails = () => cy.get('#contact-details');
export const viewAppellantName = () => cy.findAllByText('Appellant');
export const viewAgentName = () => cy.findAllByText('Agent');
export const viewTextValidationOfficer = () => cy.findAllByText('Validation officer');
export const viewTextCaseOfficer = () => cy.findAllByText('Case officer');
export const viewTextInspector = () => cy.findAllByText('Inspector');

export const viewAppellantNameEvidence = () => cy.findAllByText('Appellant name');
export const viewAgentNameEvidence = () => cy.findAllByText('Agent name');
export const viewAppellantEmailAddress = () => cy.findAllByText('Contact email address');
export const dateAppealReceivedEvidence = () => cy.findAllByText('Date appeal received');
export const descriptionOfDevelopmentEvidence = () => cy.findAllByText('Description of development');

export const appealStatementAppellantCase = () => cy.findAllByText('Appeal statement');
export const supportingDocumentsAppellantCase = () => cy.findAllByText('Supporting documents');

export const buttonCaseDetails = () => cy.get('#accordion-default-heading-1');
export const buttonAppellantCase = () => cy.get('#accordion-default-heading-2');
export const buttonLPDDocuments = () => cy.get('#accordion-default-heading-3');
export const buttonConstraints = () => cy.get('#accordion-default-heading-4');
export const buttonPolicies = () => cy.get('#accordion-default-heading-5');
export const buttonRepresentations = () => cy.get('#accordion-default-heading-6');
export const buttonCorrespondance = () => cy.get('#accordion-default-heading-7');