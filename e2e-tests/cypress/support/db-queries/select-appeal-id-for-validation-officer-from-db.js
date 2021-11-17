export const selectAppealIdForValidationOfficerFromDb = ()=>{
    cy.sqlServer("select appealId from [QuestionnaireData] where questionnaireStatus='RECEIVED'").then( (res)=>{
        cy.wrap(res).as('receivedStatusAppealId');
        //return res;
    });
}