import {goToCaseOfficerPage} from "../../../support/case-officer/go-to-page";

Given('the Case Officer is on the Questionnaires for review page',()=>{
goToCaseOfficerPage();
});

Then('the page will show the questionnaires with the status {string}',(status)=>{

    if(status==='RECEIVED'){
        cy.contains('td',status)
            .siblings()
            .contains('a')
            .click();
    }else{
        cy.contains('td',status);
    }
});