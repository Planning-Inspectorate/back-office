import {
    getAppealNotification, getAppealNotificationMissingCheckbox,
    getApplicationNotification, getApplicationNotificationMissingCheckbox,
    getApplicationPublicity, getApplicationPublicityMissingCheckbox,
    getConservationAreaMapAndGuidance, getConservationAreaMapMissingCheckbox,
    getDecisionNotice, getListingDescriptionMissingCheckbox,
    getOtherRelevantPolicies, getOtherRelevantPoliciesMissingCheckbox, getPlanningOfficerMissingCheckbox,
    getPlanningOfficersReport,
    getPlansUsedToReachDecision, getPlansUsedToReachDecisionMissingCheckbox, getPlansUsedToReachDecisionTextbox,
    getRepresentations, getRepresentationsMissingCheckbox, getStatutoryDevelopmentPlanMissingCheckbox,
    getStatutoryDevelopmentPlanPolicy,
    getSupplementaryPlanningDocuments, getSupplementaryPlanningMissingCheckbox
} from "../PageObjects/co-review-questionnaire-po";

export const reviewSectionMissingInformationCheckbox = (documentSection =>{
    if (documentSection === 'Planning Officer\'s report')
        clickMissingInfoCheckbox(documentSection, getPlanningOfficerMissingCheckbox());
    else if (documentSection === 'Plans used to reach decision')
        clickMissingInfoCheckbox(documentSection, getPlansUsedToReachDecisionMissingCheckbox());
    else if (documentSection === 'Statutory development plan policies')
        clickMissingInfoCheckbox(documentSection, getStatutoryDevelopmentPlanMissingCheckbox());
    else if(documentSection === 'Other relevant policies')
        clickMissingInfoCheckbox(documentSection, getOtherRelevantPoliciesMissingCheckbox());
    else if(documentSection === 'Supplementary planning documents')
        clickMissingInfoCheckbox(documentSection, getSupplementaryPlanningMissingCheckbox());
    else if(documentSection === 'Conservation area map and guidance')
        clickMissingInfoCheckbox(documentSection, getConservationAreaMapMissingCheckbox());
    else if(documentSection === 'Listing description'){
        if(cy.findByText('Would the development affect the setting of a listed building?').siblings('ul').contains('No')){
          return;
        }else {
            clickMissingInfoCheckbox(documentSection, getListingDescriptionMissingCheckbox());
        }
    }
    else if(documentSection === 'Application notification')
        clickMissingInfoCheckbox(documentSection, getApplicationNotificationMissingCheckbox());
    else if(documentSection === 'Application publicity')
        clickMissingInfoCheckbox(documentSection, getApplicationPublicityMissingCheckbox());
    else if(documentSection === 'Representations')
        clickMissingInfoCheckbox(documentSection, getRepresentationsMissingCheckbox());
    else if(documentSection === 'Appeal notification')
        clickMissingInfoCheckbox(documentSection, getAppealNotificationMissingCheckbox());
})

function clickMissingInfoCheckbox(documentSectionName, checkboxObject) {
    checkboxObject.click();
}