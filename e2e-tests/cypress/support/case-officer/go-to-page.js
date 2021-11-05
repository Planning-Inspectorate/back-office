export const goToCaseOfficerPage = () =>{
    cy.visit('/questionnaire-list');
    cy.checkPageA11y();
}