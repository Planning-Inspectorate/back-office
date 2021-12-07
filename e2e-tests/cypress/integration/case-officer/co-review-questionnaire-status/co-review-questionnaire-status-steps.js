import {goToCaseOfficerPage} from "../../../support/case-officer/go-to-page";
import {Given, Then } from "cypress-cucumber-preprocessor/steps";
import {
    getAppealReceivedDate,
    getAppealSiteAddress,
    getAwaitingStatus,
    getOverdueStatus,
    getReceivedStatus
} from "../../../support/PageObjects/co-questionnaire-list-po";
import {selectCaseReferenceFromDb} from "../../../support/db-queries/select-case-reference-from-db";
import {getAppealsLink} from "../../../support/PageObjects/co-review-questionnaire-po";
import {dateFormat} from "../../../support/common/date-format";
import {getAppealSite} from "../../../support/PageObjects/co-check-and-confirm-po";

Given('the Case Officer is on the Questionnaires for review page',()=>{
goToCaseOfficerPage();
});

Then('the page will show the questionnaires with the status {string}',(status)=>{
    selectCaseReferenceFromDb(status);
    cy.get('@caseReference').then((caseReference)=>{
        let appealSiteAddress = caseReference[25]+", "+caseReference[26]+", "+caseReference[27]+", "+caseReference[28]+", "+caseReference[29];
        let questionnaireReceivedDate = dateFormat(caseReference[2],'DD MMMM YYYY');
        getAppealSiteAddress(appealSiteAddress).should('exist');
        getAppealReceivedDate(questionnaireReceivedDate).should('exist');
        getAppealsLink(caseReference[23]).click();
    });
});