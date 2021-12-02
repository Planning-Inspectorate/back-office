import {Given, When} from "cypress-cucumber-preprocessor/steps";
import {
    appealStatementAppellantCase,
    appealSubmissiondate,
    applicationDecisionDate,
    buttonAppellantCase,
    buttonCaseDetails,
    buttonConstraints,
    buttonCorrespondence,
    buttonLPDDocuments,
    buttonPolicies,
    buttonRepresentations,
    dateAppealReceivedEvidence,
    decisionDateOfDecision,
    decisionOutcome,
    decisionReport,
    decisionState,
    descriptionOfDevelopmentEvidence,
    headerAppellantCase,
    headerConstraints,
    headerCorrespondence,
    headerDecision,
    headerLocalPlanningDepartmentDocuments,
    headerPolicies,
    headerQuestionnaire,
    headerRepresentation,
    headerSectionSummary,
    headerSiteVisit,
    headerStages,
    headerStart,
    headerValidation,
    labelAffectsListedBuilding,
    labelAppealNotification,
    labelApplicationNotification,
    labelApplicationPublicity,
    labelDecisionNotice,
    labelDetailsOfPlanningHistory,
    labelEmergingDevelopmentPlanOrNeighbourhoodPlan,
    labelExtraConditions,
    labelInGreenBelt,
    labelInOrNearAConservationArea,
    labelOtherRelevantPolicies,
    labelPlanningApplicationForm,
    labelPlanningOfficersReport,
    labelPlansUsedToReachDecision,
    labelRepresentations,
    labelStatutoryDevelopmentPlanPolicy,
    labelSupplementaryPlanningDocuments,
    labelSupportingDocuments,
    linkSupportingDocs,
    localPlanningDepartment,
    pageAppealDetailsTitle,
    questionnaireCaseOfficer,
    questionnaireOutcome,
    questionnaireStatus,
    questionnaireTimeStamp,
    siteVisitConfirmedType,
    siteVisitDate,
    siteVisitProvisionalType,
    siteVisitTime,
    startCaseOfficer,
    startOutcome,
    startTimeStamp,
    supportingDocumentsAppellantCase,
    validationDate,
    validationOfficer,
    validationOutcome,
    validationTimeStamp,
    validDate,
    viewAgentName,
    viewAgentNameEvidence,
    viewAppealDetailsPage,
    viewAppealSiteAddress,
    viewAppellantEmailAddress,
    viewAppellantName,
    viewAppellantNameEvidence,
    viewTextCaseFile,
    viewTextCaseOfficer,
    viewTextContactDetails,
    viewTextInspector,
    viewTextKeyDates,
    viewTextValidationOfficer,
} from "../../../support/PageObjects/cst-appeal-details-po";
import {
    appealCaseReferenceCST,inputSearchbox,
    visitSearchPage
} from "../../../support/PageObjects/cst-search-page-po";
import {continueButton} from "../../../support/PageObjects/common-po";
import {selectCaseDetailsSearchPageFromDb} from "../../../support/db-queries/select-case-details-search-page";
import {appealReference} from "../../../support/PageObjects/vo-landing-page-po";
import {appellantName} from "../../../support/PageObjects/vo-review-appeal-submission-page-po";
import {dateFormat} from "../../../support/common/date-format";
import {selectCaseFileDetailsFromDb} from "../../../support/db-queries/select-case-file-details";
import {verifyCaseDetailsOpenClose} from "../../../support/customer-support-team/case-details-expand-close";

Given( 'the user on the Search Results Page', () => {
    visitSearchPage();
    inputSearchbox().type('86274735');
    continueButton().click();
    pageAppealDetailsTitle();
     } );
When( 'the user select an appeal to view the details', () => {
    selectCaseDetailsSearchPageFromDb();
    cy.get( '@caseReferenceCST' ).then( caseReferenceCST => {
        appealCaseReferenceCST( caseReferenceCST[16] ).click();
    });
    viewAppealDetailsPage().should('contain','/bf213cc7-f5f1-4f25-9d1a-d442ea11e485');
} );
Then( "the user is presented with the appeal details in the 'Summary' section", () => {
    headerSectionSummary().should('be.visible');
    selectCaseDetailsSearchPageFromDb();
    cy.get( '@caseReferenceCST' ).then( caseReferenceCST => {
        appealReference( caseReferenceCST[16] ).should( 'exist' );
        appellantName( caseReferenceCST[18] ).should( 'exist' );
        let siteAddressCST = caseReferenceCST[19] + ', ' + caseReferenceCST[20] + ', ' + caseReferenceCST[21] + ', ' + caseReferenceCST[22] + ', ' + caseReferenceCST[23];
        viewAppealSiteAddress().contains( 'dd', siteAddressCST ).should( 'be.visible' );
        localPlanningDepartment().contains( 'dd', caseReferenceCST[49] ).should( 'be.visible' );
        viewTextCaseFile().should( 'be.visible' );
        viewTextKeyDates().should( 'be.visible' );
    });

} );
Then("the user is presented with the appeal details in the 'Case File' section", () => {
    selectCaseFileDetailsFromDb();
    cy.get('@caseFileReferenceCST').then(caseFileReferenceCST => {
        let appealDecisionDateFormat = caseFileReferenceCST[15];
        let appealDecisionDate = dateFormat(appealDecisionDateFormat,'DD MMMM YYYY');
        //applicationDecisionDate().siblings('dd',appealDecisionDate).should('be.visible');
        let appealSubmissionDateFormat = caseFileReferenceCST[16];
        let appealSubmissionDate = dateFormat(appealSubmissionDateFormat,'DD MMMM YYYY');
        appealSubmissiondate().siblings('dd',appealSubmissionDate).should('be.visible');
        validationDate().should('be.visible');
        validDate().siblings('dd',caseFileReferenceCST[42]).should('be.visible');
        viewTextContactDetails().should('be.visible');
        viewAppellantName().siblings('dd',caseFileReferenceCST[3]).should('be.visible');
        viewAgentName().should('be.visible');
        viewTextValidationOfficer().should('be.visible');
        viewTextCaseOfficer().should('be.visible');
        viewTextInspector().should('be.visible');
    });
})
const NoAgentName = 'No agent for this appeal';
Then("the user is presented with the appeal details in the 'Evidence Case Details' section", () => {
      selectCaseDetailsSearchPageFromDb();
        cy.get( '@caseReferenceCST' ).then( caseReferenceCST => {
        verifyCaseDetailsOpenClose();
        buttonCaseDetails().click();
        viewAppellantNameEvidence().siblings( 'dd', caseReferenceCST[2] ).should( 'be.visible' );
        viewAgentNameEvidence().siblings('dd', NoAgentName).should( 'be.visible' );
        viewAppellantEmailAddress().siblings('dd',caseReferenceCST[1]).should( 'be.visible' );
        let appealSubmissionDateFormat = caseReferenceCST[16];
        let appealSubmissionDate = dateFormat(appealSubmissionDateFormat,'DD MMMM YYYY');
        dateAppealReceivedEvidence().siblings('dd',appealSubmissionDate).should('be.visible');
        descriptionOfDevelopmentEvidence().siblings('dd',caseReferenceCST[39]).should('be.visible');
    } );
});
Then("the user is presented with the appeal details in the 'Evidence Appellant Case' section", () => {
    headerAppellantCase().should('be.visible');
    buttonAppellantCase().click();
    appealStatementAppellantCase().should('be.visible');
    appealStatementAppellantCase().siblings('dd').click();
    supportingDocumentsAppellantCase().should('be.visible');
    linkSupportingDocs().siblings().within(() =>
    {
            cy.get('ul>li').each(($el, index, $list) =>
            {
                    cy.wrap($el).should('be.visible');
            })
        });
    });
Then("the user is presented with the appeal details in the 'Evidence Local Planning Department Documents' section", () =>{
    headerLocalPlanningDepartmentDocuments().should('be.visible');
    buttonLPDDocuments().click();
    labelPlansUsedToReachDecision().should('be.visible');
    labelPlanningApplicationForm().siblings('dd','.govuk-link').should('be.visible');
    labelPlanningOfficersReport().should('be.visible');
    labelDecisionNotice().should('be.visible');
    labelExtraConditions().should('be.visible');
    labelDetailsOfPlanningHistory().should('be.visible');
    labelSupportingDocuments().should('be.visible');
});
Then("the user is presented with the appeal details in the 'Evidence Constraints' section", () => {
    headerConstraints().should('be.visible');
    buttonConstraints().click();
    labelAffectsListedBuilding().should('be.visible');
    labelInGreenBelt().should('be.visible');
    labelInOrNearAConservationArea().should('be.visible');
})

Then("the user is presented with the appeal details in the 'Evidence Policies' section", () => {
    headerPolicies().should('be.visible');
    buttonPolicies().click();
    labelStatutoryDevelopmentPlanPolicy().should('be.visible');
    labelOtherRelevantPolicies().should('be.visible');
    labelSupplementaryPlanningDocuments().should('be.visible');
    labelEmergingDevelopmentPlanOrNeighbourhoodPlan().should('be.visible');
})
Then("the user is presented with the appeal details in the 'Evidence Representation' section", () => {
    headerRepresentation().should('be.visible');
    buttonRepresentations().click();
    labelRepresentations().should('be.visible');
})
Then("the user is presented with the appeal details in the 'Evidence Correspondence' section", () => {
    headerCorrespondence().should('be.visible');
    buttonCorrespondence().click();
    labelApplicationNotification().should('be.visible');
    labelApplicationPublicity().should('be.visible');
    labelAppealNotification().should('be.visible');
})
Then("the user is presented with the appeal details in the 'Stages Validation' section", () => {
    headerStages().should('be.visible');
    headerValidation().should('be.visible');
    selectCaseDetailsSearchPageFromDb();
    cy.get( '@caseReferenceCST' ).then( caseReferenceCST => {
        validationOutcome().should('be.visible');
        validationOutcome().siblings('dd',caseReferenceCST[54]).should('be.visible');
        validationTimeStamp().siblings('dd',caseReferenceCST[42]).should('be.visible');
    });
    validationOfficer().should('be.visible');
})
Then("the user is presented with the appeal details in the 'Stages Start' section", () => {
    headerStart().should('be.visible');
    startOutcome();
    startTimeStamp();
    startCaseOfficer();
});
Then("the user is presented with the appeal details in the 'Stages Questionnaire' section", () => {
    headerQuestionnaire().should('be.visible');
    questionnaireStatus();
    questionnaireOutcome();
    questionnaireTimeStamp();
    questionnaireCaseOfficer()
});
Then("the user is presented with the appeal details in the 'Stages Site Visit' section", () => {
    headerSiteVisit().should('be.visible');
    siteVisitProvisionalType();
    siteVisitConfirmedType();
    siteVisitDate();
    siteVisitTime();
});
Then("the user is presented with the appeal details in the 'Stages Decision' section", () => {
    headerDecision().should('be.visible');
    decisionOutcome();
    decisionDateOfDecision();
    decisionReport();
    decisionState();
});

