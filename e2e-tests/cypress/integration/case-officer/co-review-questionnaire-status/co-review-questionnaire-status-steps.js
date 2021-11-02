import {goToCaseOfficerPage} from "../../../support/case-officer/go-to-page";
import {Given, Then } from "cypress-cucumber-preprocessor/steps";
import {
    getAwaitingStatus,
    getOverdueStatus,
    getReceivedStatus
} from "../../../support/PageObjects/co-questionnaire-list-po";

Given('the Case Officer is on the Questionnaires for review page',()=>{
goToCaseOfficerPage();
});

Then('the page will show the questionnaires with the status {string}',(status)=>{

    if(status==='RECEIVED'){
        getReceivedStatus().siblings()
            .contains('a')
            .click();
    }else if(status === 'OVERDUE'){
      getOverdueStatus().should('be.visible');
    }else{
        getAwaitingStatus().should('be.visible');
    }
});