export const verifyPageTitle = (title) =>{
    cy.title().should('eq', title);
}