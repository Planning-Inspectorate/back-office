export const verifyPageUrl = (url) => {
    cy.url().should('include',url);
};