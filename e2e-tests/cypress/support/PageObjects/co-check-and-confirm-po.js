export const getSectionHeading = () => cy.get('h2');
export const getReviewOutcome = () =>cy.findByText('Review outcome');
export const getAppealReference = () => cy.findByText('Appeal reference');
export const getAppealSite = () => cy.findByText('Appeal site');
export const getLocalPlanningDepartment = () => cy.findByText('Local planning department');
export const getMissingOrIncorrectDocuments = () => cy.findByText('Missing or incorrect documents');
export const getConfirmContinueButton = () => cy.findByRole('button',{name:/Confirm outcome/});
export const getGoBackToReviewQuestionnaireLink = () => cy.findByRole('link',{name:'Go back to review questionnaire'});