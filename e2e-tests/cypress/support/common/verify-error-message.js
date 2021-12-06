export const verifyErrorMessage = (errorMessage, errorMessageObjectId, summaryErrorMessage) => {
    summaryErrorMessage().should('be.visible');
    cy.title().should('contain', 'Error:');
    cy.checkPageA11y();

    summaryErrorMessage()
        .invoke('text')
        .then((text) => {
            expect(text).to.contain(errorMessage);
        });

    if (errorMessageObjectId) {
        const errorMessageObject = cy.get(errorMessageObjectId);
        errorMessageObject.should('be.visible');
        errorMessageObject.invoke('text').then((text) => {
            expect(text).to.contain(errorMessage);
        });
    }
};