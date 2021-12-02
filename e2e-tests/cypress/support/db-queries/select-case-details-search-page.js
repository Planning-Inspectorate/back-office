export const selectCaseDetailsSearchPageFromDb = () => {
    cy.sqlServer("select * from appealdata where casereference like '9%'").then( (res)=>{
    cy.wrap(res).as('caseReferenceCST');
    });
}