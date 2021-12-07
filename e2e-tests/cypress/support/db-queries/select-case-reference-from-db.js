export const selectCaseReferenceFromDb = (status) =>{
    if(status=== 'Received'){
        cy.sqlServer("select * from [QuestionnaireData] where questionnaireStatus='RECEIVED'").then( (res)=>{
            console.log(res);
            cy.wrap(res).as('caseReference');
            //return res;
        });
    }
    else if(status==='Overdue'){
        cy.sqlServer("select caseReference from [QuestionnaireData] where questionnaireStatus='OVERDUE'").then( (res)=>{
            cy.wrap(res).as('caseReference');
            //return res;
        });
    }else{
        cy.sqlServer("select caseReference from [QuestionnaireData] where questionnaireStatus='AWAITING'").then( (res)=>{
            cy.wrap(res).as('caseReference');
            //return res;
        });
    }


}