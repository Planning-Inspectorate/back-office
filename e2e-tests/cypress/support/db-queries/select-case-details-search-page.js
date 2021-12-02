export const selectCaseDetailsSearchPageFromDb = () => {
    cy.sqlServer("select * from dbo.AppealData where caseReference = '86274735'").then( (res)=>{
        cy.wrap(res).as('caseReferenceCST');
    });
}