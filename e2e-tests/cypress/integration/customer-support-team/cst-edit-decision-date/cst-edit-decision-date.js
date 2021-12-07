import {Given, When} from "cypress-cucumber-preprocessor/steps";
import {appealCaseReferenceCST, inputSearchbox, visitSearchPage} from "../../../support/PageObjects/cst-search-page-po";
import {backLink, continueButton} from "../../../support/PageObjects/common-po";
import {
    applicationDecisionDate,
    pageAppealDetailsTitle,
    pageSearchResultsTitle,
    viewAppealDetailsPage
} from "../../../support/PageObjects/cst-appeal-details-po";
import {selectCaseDetailsSearchPageFromDb} from "../../../support/db-queries/select-case-details-search-page";
import {
    errorOnLabel,
    errorSummaryTitle,
    inputDay,
    linkApplicationDecisionDate,
    pageDecisionDate,
    pageTitleDecisionDate, visitDecisionDate
} from "../../../support/PageObjects/cst-edit-decision-date-po";
import {dateFormat} from "../../../support/common/date-format";
import {decisionDateObj} from "../../../support/common/validate-day-month-year";
import {validateErrorMessages} from "../../../support/common/validate-error-messages";
import {verifyErrorMessage} from "../../../support/common/verify-error-message";
import {verifyPageTitle} from "../../../support/common/verify-page-title";
import {verifyPageHeading} from "../../../support/common/verify-page-heading";
const pageHeading = 'Change application decision date';
const pageTitle = 'Change application decision date - Appeal a householder planning decision - GOV.UK';

Given( 'user is on the Appeal Details page', () => {
    visitSearchPage();
    inputSearchbox().type('9');
    continueButton().click();
    pageSearchResultsTitle();
    selectCaseDetailsSearchPageFromDb();
    cy.get( '@caseReferenceCST' ).then( caseReferenceCST => {
        appealCaseReferenceCST( caseReferenceCST[16] ).click();
        viewAppealDetailsPage().should('contain',caseReferenceCST[0]);
    });
} );
When( 'the user click on Change Outcome link for application decision date in the case file section', () => {
    linkApplicationDecisionDate().click();
} );
Then( "the 'Change decision date' page will be displayed", () => {
    pageDecisionDate();
    } );

Given( "user is on the 'Change decision date'", () => {
    visitSearchPage();
    inputSearchbox().type('9');
    continueButton().click();
    pageSearchResultsTitle();
    selectCaseDetailsSearchPageFromDb();
    cy.get( '@caseReferenceCST' ).then( caseReferenceCST => {
        appealCaseReferenceCST( caseReferenceCST[16] ).click();
        viewAppealDetailsPage().should('contain',caseReferenceCST[0]);
    });
    linkApplicationDecisionDate().click();
    verifyPageTitle(pageTitle);
    verifyPageHeading(pageHeading);
    cy.checkPageA11y();
   } );
When( "user edits the information and saves", () => {
    inputDay().clear().type('10');
    continueButton().click();
} );
Then( "user can see that the Application date now reads correctly", () => {
    viewAppealDetailsPage().should('exist');
    selectCaseDetailsSearchPageFromDb();
    cy.get( '@caseReferenceCST' ).then( caseReferenceCST => {
        let appealDecisionDateFormat = caseReferenceCST[14];
        let appealDecisionDate = dateFormat( appealDecisionDateFormat, 'DD MMMM YYYY' );
        applicationDecisionDate().siblings( 'dd', appealDecisionDate ).should( 'be.visible' );
    });
} );

When("user edits the {string} and {string} and {string}", (day, month, year) => {
    decisionDateObj(day,month,year);
    continueButton().click();
})
Then("user can see the validation message as {string}", (errorMessage) => {
    //validateErrorMessages(reason);
    verifyErrorMessage(errorMessage,errorOnLabel,errorSummaryTitle);
})

When('user click on Back link', () => {
    backLink().click();
})
Then('user should be on the Appeal Details page', () => {
    viewAppealDetailsPage();
    })