export const selectAppealIdForValidationOfficerFromDb = ()=>{
    cy.sqlServer("select * from AppealData where caseStatusId = 1").then( (res)=>{
        cy.wrap(res).as('appealReferenceVO');
    });
}