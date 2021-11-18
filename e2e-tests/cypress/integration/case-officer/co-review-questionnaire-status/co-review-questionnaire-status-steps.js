import {goToCaseOfficerPage} from "../../../support/case-officer/go-to-page";
import {Given, Then } from "cypress-cucumber-preprocessor/steps";
import {
    getAwaitingStatus,
    getOverdueStatus,
    getReceivedStatus
} from "../../../support/PageObjects/co-questionnaire-list-po";
import {selectCaseReferenceFromDb} from "../../../support/db-queries/select-case-reference-from-db";
import {getAppealsLink} from "../../../support/PageObjects/co-review-questionnaire-po";

Given('the Case Officer is on the Questionnaires for review page',()=>{
goToCaseOfficerPage();
});

Then('the page will show the questionnaires with the status {string}',(status)=>{
    selectCaseReferenceFromDb(status);
    cy.get('@caseReference').then((caseReference)=>{
        getAppealsLink(caseReference).click();
    });
});