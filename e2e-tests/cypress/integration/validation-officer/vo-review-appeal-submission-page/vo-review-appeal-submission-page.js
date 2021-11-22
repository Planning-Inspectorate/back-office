import {Given, When, Then} from "cypress-cucumber-preprocessor/steps";
import {
    appealDate,
    appealReference,
    caseOfficerLandingPage,
    validationOfficerLandingPage
} from "../../../support/PageObjects/vo-landing-page-po";
import {
    appealSite,
    appealStatement,
    appellantName,
    decisionLetter,
    headerReviewSubmission,
    localPlanningDept,
    planningAppForm,
    planningAppReference,
    receivedOn,
    reviewAppealSubmissionPage,
    supportingDocs,
    titleReviewSubmission,
    selectOutcomeValid,
    visitReviewAppealSubmissionPage,
} from "../../../support/PageObjects/vo-review-appeal-submission-page-po";
import {descriptionOfDevelopmentPage} from "../../../support/PageObjects/vo-validappeal-description-of-development-po"
import {backLink, continueButton} from "../../../support/PageObjects/common-po";
import {validateErrorMessages} from "../../../support/common/validate-error-messages";
import {selectAppealIdForValidationOfficerFromDb} from "../../../support/db-queries/select-appeal-id-for-validation-officer-from-db";
import moment from "moment";
import {dateFormat} from "../../../support/common/date-format";


Given( "validation Officer is on the ‘Appeal submissions for review’ page", () => {
    validationOfficerLandingPage();
} );
When( "the Validation Officer selects an appeal", () => {
    selectAppealIdForValidationOfficerFromDb();
    cy.get('@appealReferenceVO').then(appealReferenceVO => {
        appealReference(appealReferenceVO[16]).should('exist').click();
    })
} );
Then( "the ‘Review appeal submission’ Page will be displayed", () => {
   selectAppealIdForValidationOfficerFromDb();
    cy.get('@appealReferenceVO').then(appealReferenceVO =>
    {
        let appealID = appealReferenceVO[0];
        cy.url().should('contain','/review-appeal-submission/' + appealID);
    })
} );

Given( "validation Officer has not chosen an outcome on the ‘Review appeal submission’ page", () => {
    //visitReviewAppealSubmissionPage();
    selectAppealIdForValidationOfficerFromDb();
    cy.get('@appealReferenceVO').then(appealReferenceVO =>
    {
        let appealID = appealReferenceVO[0];
        cy.url().should('contain','/review-appeal-submission/' + appealID);
    })
} );
When( "the Validation Officer selects ‘Continue’", () => {
    continueButton().click();
} );
Then( "error message {string} is displayed", (errorMessage) => {
    validateErrorMessages(errorMessage);
} );

Given( "validation Officer is on the ‘Review appeal submission’ page", () => {
   visitReviewAppealSubmissionPage();
} );
When( "the Validation Officer selects the ‘Back’ link", () => {
    backLink().click();
} );
Then( "the ‘Appeal submissions for review’ page will be displayed", () =>{
    validationOfficerLandingPage();
} );

When( 'the Validation Officer selects the appeal', () => {
   // appealReference().click();
    selectAppealIdForValidationOfficerFromDb();
    cy.get( '@appealReferenceVO' ).then( appealReferenceVO => {
        appealReference( appealReferenceVO[16] ).should( 'exist' ).click();
    }  );
} );

Then( "the ‘Review appeal submission’ Page will be displayed with the Appellant details", () =>{
    headerReviewSubmission().should('contain.text', "Review appeal submission");
    titleReviewSubmission();
    cy.checkPageA11y();
    selectAppealIdForValidationOfficerFromDb();
    cy.get('@appealReferenceVO'). then (appealReferenceVO => {
        appellantName(appealReferenceVO[18]).should('exist');
           })
     cy.get('@appealReferenceVO'). then (appealReferenceVO => {
        appealReference(appealReferenceVO[16]).should('exist');
    })
    cy.get('@appealReferenceVO'). then (appealReferenceVO =>
    {
        let receivedOnDate = appealReferenceVO[15];
        let appealReceivedDate = dateFormat(receivedOnDate,"D MMM YYYY");
        receivedOn(appealReceivedDate).should('exist');
        appealReference(appealReferenceVO[16]).should('exist');
        appealSite().siblings('dd')
            .should('contain',appealReferenceVO[19] )
            .should('contain',appealReferenceVO[20] )
            .should('contain',appealReferenceVO[21] )
            .should('contain',appealReferenceVO[22] )
            .should('contain',appealReferenceVO[23] );
        planningAppReference().siblings('dd').should('contain',appealReferenceVO[16]);
        localPlanningDept().siblings('dd').should('contain',appealReferenceVO[46]);
        planningAppForm().siblings('dd').click();
        decisionLetter().siblings('dd').click();
        appealStatement().siblings('dd').click();
        supportingDocs().should('exist').click();
    })
 } );

Given( "validation Officer has selected outcome as valid on the ‘Review appeal submission’ page", () => {
    validationOfficerLandingPage();
    selectAppealIdForValidationOfficerFromDb();
    cy.get( '@appealReferenceVO' ).then( appealReferenceVO => {
        let siteAddress = appealReferenceVO[19] + ', ' + appealReferenceVO[20] + ', ' + appealReferenceVO[21] + ', ' + appealReferenceVO[22] + ', ' + appealReferenceVO[23];
        let receivedOnDate = appealReferenceVO[15];
        let appealReceivedDate = dateFormat( receivedOnDate, "D MMM YYYY" );
        appealReference( appealReferenceVO[16] ).should( 'exist' ).click();
        reviewAppealSubmissionPage();
        cy.checkPageA11y();
        selectOutcomeValid().click();
    } );
});


Then( 'description of Development page is displayed', () => {
    descriptionOfDevelopmentPage();
} );