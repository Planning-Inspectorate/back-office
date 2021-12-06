import {Given, When, Then } from "cypress-cucumber-preprocessor/steps";
import {
    getAppealReference,
    getAppealSite,
    getConfirmContinueButton,
    getGoBackToReviewQuestionnaireLink,
    getLocalPlanningDepartment, getMissingOrIncorrectDocuments,
    getReviewOutcome
} from "../../../support/PageObjects/co-check-and-confirm-po";
import {verifySectionName} from "../../../support/case-officer/verify-Section-Name";
import {
    getAppealsLink,
    getContinueButton,
    getQuestionnaireForReviewBack, getSupplementaryPlanningMissingCheckbox
} from "../../../support/PageObjects/co-review-questionnaire-po";
import {reviewSectionMissingInformationCheckbox} from "../../../support/case-officer/review-section-missing-information-check-box";
import {reviewSectionMissingInformation} from "../../../support/case-officer/review-section-missing-information";
import {selectCaseReferenceFromDb} from "../../../support/db-queries/select-case-reference-from-db";
import {goToCaseOfficerPage} from "../../../support/case-officer/go-to-page";
import {verifyPageHeading} from "../../../support/common/verify-page-heading";

Given('Case officer is on the Review questionnaire page for {string} status',(status)=>{
    goToCaseOfficerPage();
    selectCaseReferenceFromDb(status);
    cy.get('@caseReference').then((caseReference)=>{
        getAppealsLink(caseReference[23]).click();
    });
});

Given('Case officer can see the {string} information for {string}',(missing_information, document_section)=>{
    if(document_section!=='Application publicity'|| document_section!=='Planning Officer\'s report'){
        getMissingOrIncorrectDocuments()
            .siblings('dd')
            .should('contain',document_section);
    }else{
        getMissingOrIncorrectDocuments()
            .siblings('dd')
            .should('contain', missing_information)
            .should('contain',document_section);
    }
});
When('Case Officer finishes the review as no missing information',()=>{
    getContinueButton().click();
});
When('the questionnaire review is {string}',(questionnaireReviewStatus)=>{
    verifySectionName('Check and confirm');
});

When(`the Case officer enters {string} information for {string}`,(missing_information, document_section)=>{
    reviewSectionMissingInformationCheckbox(document_section);
    reviewSectionMissingInformation(missing_information,document_section);
    getContinueButton().click();
});

When('Case Officer clicks on {string} for {string} status',(breadcrumb,status)=>{
    if(breadcrumb==='review questionnaire submission'){
        selectCaseReferenceFromDb(status);
        cy.get('@caseReference').then((caseReference)=>{
            cy.findByRole('link', { name : caseReference[23].toString() }).click();
        });
    }else{
        getQuestionnaireForReviewBack().click();
    }
});

When('Case Officer clicks on Go back to review questionnaire',()=>{
    getGoBackToReviewQuestionnaireLink().click();
});

When('Case Officer clicks on Confirm outcome',()=>{
    getConfirmContinueButton().click();
});

When('the Case officer unchecks the {string}',(document_section)=>{
    cy.get(':checkbox').uncheck({force: true});
    getContinueButton().click();
});

Then('the {string} page is displayed showing the questionnaire as {string}',(page,questionnaireReviewStatus)=>{
verifySectionName(page);
getReviewOutcome().siblings().should('contain',questionnaireReviewStatus);
    getAppealReference().should('be.visible');
    selectCaseReferenceFromDb('Received');
    cy.get('@caseReference').then((caseReference)=>{
        getAppealReference().siblings('dd').should('contain',caseReference[23]);
    });
    getAppealSite().should('be.visible');
    if(questionnaireReviewStatus==='Incomplete'){
        getMissingOrIncorrectDocuments().should('be.visible');
    }

    getLocalPlanningDepartment().should('be.visible');
    getConfirmContinueButton().should('have.class','govuk-button');
    getGoBackToReviewQuestionnaireLink().should('have.attr','href');
});

Then(`Case officer can see the {string} for the {string}`,(missing_information, document_section)=>{
    if(document_section!=='Application publicity'|| document_section!=='Planning Officer\'s report'){
        getMissingOrIncorrectDocuments()
            .siblings('dd')
            .should('contain',document_section);
    }else{
        getMissingOrIncorrectDocuments()
            .siblings('dd')
            .should('contain', missing_information)
            .should('contain',document_section);
    }

});

Then('Case Officer is navigated to the {string}',(page)=>{
    if(page==='Review questionnaire'){
       verifyPageHeading('Review questionnaire');
    }else{
        verifyPageHeading('Questionnaires for review');
    }
});

Then('Case Officer is navigated to the Review Questionnaire',()=>{
    verifyPageHeading('Review questionnaire');
});

Then('Case officer is navigated to confirm outcome page',()=>{
    cy.get('h1').should('contain','Outcome confirmed');
});