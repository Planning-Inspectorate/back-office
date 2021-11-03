
export const invalidAppealDetailsPage = () => cy.visit('/invalid-appeal-details');

export const pageTitleCheckConfirm = () => cy.title().should('include','Invalid appeal details - Appeal a householder planning decision - GOV.UK');

export const invalidPageHeader = () => cy.get('.govuk-heading-xl').should('contain','Invalid appeal details');

export const appealReferenceValidation = () => cy.get('p.govuk-body');

export const reasonsAppealInvalid = () => cy.findAllByText('Reasons the appeal is invalid').should('be.visible');

export const reasonsOutOfTime = () => cy.findAllByText('Out of time');

export const reasonsOutOfTimeCheck = () => cy.get('[id=invalid-appeal-reasons]');

export const reasonsNoRightOfAppeal = () => cy.findAllByText('No right of appeal').should('be.visible');

export const reasonsNoRightOfAppealCheck = () => cy.get('[id=invalid-appeal-reasons-2]')

export const reasonsNotAppealable = () => cy.findByText('Not appealable').should('be.visible');

export const reasonsNotAppealableCheck = () => cy.get('[id=invalid-appeal-reasons-3]');

export const reasonsLPADeemedApplications = () => cy.findByText('LPA deemed application as invalid').should('be.visible');

export const reasonsLPADeemedApplicationsCheck = () => cy.get('[id=invalid-appeal-reasons-4]');

export const reasonsOther = () => cy.get('[id=invalid-appeal-reasons-5]');

export const reasonsOtherCheck = () => cy.get('[id=invalid-appeal-reasons-5]');

export const otherListReasons = () => cy.get('[id=other-reason]');

export const labelOtherListReasons = () => cy.get('[id=conditional-invalid-appeal-reasons-5]').should('contain','List reasons');

export const labelOtherListReasonsHintText = () => cy.get('[id=other-reason-hint]').should('contain','This will be sent to the appellant and LPA');

export const selectOutcomeInvalid = () => cy.get('[id=review-outcome-2]');









