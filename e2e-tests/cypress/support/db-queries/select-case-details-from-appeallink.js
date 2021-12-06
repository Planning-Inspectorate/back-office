export const selectCaseFileDetailsFromAppealLinkDb = (appealID) => {
    cy.sqlServer("select * from AppealLink where AppealId = appealID and LatestEvent = 1").then( (res)=>{
        cy.wrap(res[0]).as('ObjcaseFileDetails');
    });
}
