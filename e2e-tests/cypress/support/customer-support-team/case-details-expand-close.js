export const verifyCaseDetailsOpenClose = () =>{
    cy.get('.govuk-accordion__open-all').click();
    cy.findAllByText('Close all').click();
}


