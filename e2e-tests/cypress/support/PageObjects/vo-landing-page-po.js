exports.yesRadioBtn = () => {
    cy.get('[data-cy=answer-yes]').click();
}

exports.decisionDatePage = () => {
    cy.visit("http://localhost:9003/eligibility/decision-date");
    const DecisionDatePageTitle = cy.title().should('eq', "What's the decision date on the letter from the local planning department? - Eligibility - Appeal a householder planning decision - GOV.UK");
}

exports.houseHolderErrorPage = () => {
    cy.title().should('include','Error: Did you apply for householder planning permission? - Eligibility - Appeal a householder planning decision - GOV.UK');
}

exports.noSelectionErrorMessg = () => {
    cy.get('#householder-planning-permission-error');
}

