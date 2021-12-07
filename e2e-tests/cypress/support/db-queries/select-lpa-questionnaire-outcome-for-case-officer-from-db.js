export const selectLpaQuestionnaireOutcomeForCaseOfficerFromDb =(appealId) =>{
    cy.sqlServer("select LPAQuestionnaireReviewOutcomeID from [HASAppeal] where AppealID='"+appealId+"' and LatestEvent=1").then((res)=>{
        cy.wrap(res).as('lpaQuestionnaireOutcome');
    });
}