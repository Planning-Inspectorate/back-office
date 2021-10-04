export const goToCaseOfficerPage = () =>{
    cy.visit('/questionnaire-list');
    cy.checkA11y();
}