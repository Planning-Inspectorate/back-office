export const houseHolderPage = () => {
    return cy.visit("http://localhost:9003/eligibility/householder-planning-permission");

}

export const yesRadioBtn = () => {
    return cy.get('[data-cy=answer-yes]').click();
}


export const decisionDatePage = () => {
    return cy.visit("http://localhost:9003/eligibility/decision-date");
    const DecisionDatePageTitle = cy.title().should('eq', "What's the decision date on the letter from the local planning department? - Eligibility - Appeal a householder planning decision - GOV.UK");
    }

export const houseHolderErrorPage = () => {
    return cy.title().should('include','Error: Did you apply for householder planning permission? - Eligibility - Appeal a householder planning decision - GOV.UK');
}

export const noSelectionErrorMessage = () => {
    return cy.get('#householder-planning-permission-error');
}

