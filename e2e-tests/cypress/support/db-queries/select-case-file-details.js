export const selectCaseFileDetailsFromDb = (appealID) => {
    cy.sqlServer("select * from dbo.HASAppealSubmission where appealid = appealID").then( (res)=>{
        cy.wrap(res[0]).as('caseFileReferenceCST');
    });
}
