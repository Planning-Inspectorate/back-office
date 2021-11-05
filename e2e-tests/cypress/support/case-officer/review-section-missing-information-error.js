import {
    getAppealNotificationError,
    getApplicationNotificationError,
    getConservationAreaMapError,
    getListingDescriptionError, getOtherRelevantPoliciesError,
    getPlansUsedToReachDecisionError, getRepresentationsError,
    getStatutoryDevelopmentPlanError,
    getSupplementaryPlanningError
} from "../PageObjects/co-review-questionnaire-po";
import {errorMessageHeader} from "../PageObjects/vo-review-appeal-submission-page-po";

export const reviewSectionMissingInformationError = (errorMessage, documentSection) => {
    cy.title().should('match', /^Error: /);
    //cy.checkPageA11y();
    errorMessageHeader().should('be.visible');
    errorMessageHeader().invoke('text')
        .then((text) => {
            expect(text).to.contain(errorMessage);
        });
    if (documentSection === 'Plans used to reach decision'){
        getPlansUsedToReachDecisionError().should('be.visible');
        getPlansUsedToReachDecisionError().invoke('text')
            .then((text)=>{
                expect(text).to.contain(errorMessage);
            });
    }

    else if (documentSection === 'Statutory development plan policies'){
        getStatutoryDevelopmentPlanError().should('be.visible');
        getStatutoryDevelopmentPlanError().invoke('text')
            .then((text)=>{
                expect(text).to.contain(errorMessage);
            });
    }
    else if (documentSection === 'Other relevant policies') {
        getOtherRelevantPoliciesError().should('be.visible');
        getOtherRelevantPoliciesError().invoke('text')
            .then((text)=>{
                expect(text).to.contain(errorMessage);
            });
    }
    else if (documentSection === 'Supplementary planning documents') {
        getSupplementaryPlanningError().should('be.visible');
        getSupplementaryPlanningError().invoke('text')
            .then((text)=>{
                expect(text).to.contain(errorMessage);
            });
    }
    else if (documentSection === 'Conservation area map and guidance') {
        getConservationAreaMapError().should('be.visible');
        getConservationAreaMapError().invoke('text')
            .then((text)=>{
                expect(text).to.contain(errorMessage);
            });
    }
    else if (documentSection === 'Listing description') {
        getListingDescriptionError().should('be.visible');
        getListingDescriptionError().invoke('text')
            .then((text)=>{
                expect(text).to.contain(errorMessage);
            });
    }
    else if (documentSection === 'Application notification') {
        getApplicationNotificationError().should('be.visible');
        getApplicationNotificationError().invoke('text')
            .then((text)=>{
                expect(text).to.contain(errorMessage);
            });
    } else if (documentSection === 'Representations') {
        getRepresentationsError().should('be.visible');
        getRepresentationsError().invoke('text')
            .then((text)=>{
                expect(text).to.contain(errorMessage);
            });
    }
    else if (documentSection === 'Appeal notification') {
        getAppealNotificationError().should('be.visible');
        getAppealNotificationError().invoke('text')
            .then((text)=>{
                expect(text).to.contain(errorMessage);
            });
    }
}