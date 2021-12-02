export const selectCaseFileDetailsFromDb = ()=>{
    cy.sqlServer("select * from dbo.HASAppealSubmission where appealid = 'bf213cc7-f5f1-4f25-9d1a-d442ea11e485'").then( (res)=>{
        cy.wrap(res).as('caseFileReferenceCST');
    });
}
