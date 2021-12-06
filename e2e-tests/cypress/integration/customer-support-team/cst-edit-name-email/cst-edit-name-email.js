import {Given, When} from "cypress-cucumber-preprocessor/steps";
import {
    editNameChangeOutcome,
    inputAppellantEmailAddress,
    inputAppellantName,
    labelAppellantEmailAddress,
    labelAppellantName,
    pageChangeAppellantDetails,
    pageTitleEditName
} from "../../../support/PageObjects/cst-edit-name-email-po";

import {verifyPageHeading} from "../../../support/common/verify-page-heading";
import {
    viewAppellantEmailAddress,
    viewAppellantEmailContactDetails,
    viewAppellantName,
    viewAppellantNameEvidence
} from "../../../support/PageObjects/cst-appeal-details-po";
import {selectCaseFileDetailsFromAppealLinkDb} from "../../../support/db-queries/select-case-details-from-appeallink";
import {validateErrorMessages} from "../../../support/common/validate-error-messages";
import {nameEmailObj} from "../../../support/common/validate-name-email";
const {visitSearchPage, inputSearchbox, appealCaseReferenceCST} = require( "../../../support/PageObjects/cst-search-page-po" );
const {continueButton} = require( "../../../support/PageObjects/common-po" );
const {pageSearchResultsTitle, viewAppealDetailsPage, pageAppealDetailsTitle} = require( "../../../support/PageObjects/cst-appeal-details-po" );
const {selectCaseDetailsSearchPageFromDb} = require( "../../../support/db-queries/select-case-details-search-page" );

Given( 'the user is on the Appeal Details page', () => {
    visitSearchPage();
    inputSearchbox().type('9');
    continueButton().click();
    pageSearchResultsTitle();
    selectCaseDetailsSearchPageFromDb();
    cy.get( '@caseReferenceCST' ).then( caseReferenceCST => {
        appealCaseReferenceCST( caseReferenceCST[16] ).click();
        viewAppealDetailsPage().should('contain',caseReferenceCST[0]);
    });
    pageAppealDetailsTitle();
} );
When( 'the user selects appellant name in the summary section', () => {
    editNameChangeOutcome().click();
} );
Then("the 'Change appellant details' page will be displayed", () => {
    pageTitleEditName();
    verifyPageHeading('Change appellant details');
    selectCaseDetailsSearchPageFromDb();
    cy.get( '@caseReferenceCST' ).then( caseReferenceCST => {
        pageChangeAppellantDetails().should('contain',caseReferenceCST[0] );
        labelAppellantName().should('be.visible');
        inputAppellantName().should('have.value',caseReferenceCST[18] );
        labelAppellantEmailAddress().should('be.visible');
        inputAppellantEmailAddress().should('have.value',caseReferenceCST[1]);

    });
});
Given( "the user is on the Change appellant details page", () => {
    visitSearchPage();
    inputSearchbox().type('9');
    continueButton().click();
    pageSearchResultsTitle();
    selectCaseDetailsSearchPageFromDb();
    cy.get( '@caseReferenceCST' ).then( caseReferenceCST => {
        appealCaseReferenceCST( caseReferenceCST[16] ).click();
        viewAppealDetailsPage().should('contain',caseReferenceCST[0]);
        editNameChangeOutcome().click();
        pageChangeAppellantDetails().should('contain',caseReferenceCST[0] );
    });
} );
When( "the user edits the information and saves", () => {
    inputAppellantName().clear().type('{home}NewRow-Test Appellant Name');
    inputAppellantEmailAddress().clear().type('{home}NewRow.Test@Gmail.com');
    continueButton().click();
} );
Then( "the appellant's name and email address are updated on the Appeal Details page within the summary, contact details, appellant case", () => {
    selectCaseDetailsSearchPageFromDb();
    cy.get( '@caseReferenceCST' ).then( caseReferenceCST =>
    {
        let appealId = caseReferenceCST[0];
        selectCaseFileDetailsFromAppealLinkDb(appealId);
        cy.get( '@ObjcaseFileDetails' ).then( ObjcaseFileDetails =>
        {
            viewAppellantName().siblings('dd',caseReferenceCST[18]);
            viewAppellantEmailContactDetails().should('be.visible');
            viewAppellantNameEvidence().siblings('dd',caseReferenceCST[18]);
            viewAppellantEmailAddress().siblings('dd',ObjcaseFileDetails[1]);
        });
    });
    });

Then( "name is invalid because {string}", (nameReason) => {
     validateErrorMessages(nameReason);
} );

Then( "email is invalid because {string}", (emailReason) => {
    validateErrorMessages(emailReason);

} );
When("the user click on Save Changes button", () => {
    inputAppellantName().clear();
    inputAppellantEmailAddress().clear();
    continueButton().click();
})
When( "{string} and {string} are submitted", (name,email) => {
    nameEmailObj(name,email);
    continueButton().click();
} );
When( "the user enter name only and click on Save Changes button", () => {
    inputAppellantName().clear().type('{home}NewRow-Test Appellant Name');
    inputAppellantEmailAddress().clear();
    continueButton().click();
} );
Then( "name validation error message {string} is displayed", (nameError) => {
    validateErrorMessages(nameError);
} );
When( "the user enter email only and click on Save Changes button", () => {
    inputAppellantName().clear();
    inputAppellantEmailAddress().clear().type('{home}NewRow.Test@Gmail.com');
    continueButton().click();
} );
Then( "email validation error message {string} is displayed", (emailError) => {
    validateErrorMessages(emailError);
} );