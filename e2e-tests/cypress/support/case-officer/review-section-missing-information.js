import {
    getAppealNotification,
    getAppealNotificationCopyOfLetterCheckbox, getAppealNotificationListOfAddressesCheckbox, getApplicationNotification,
    getApplicationNotificationCopyOfLetterCheckbox,
    getApplicationNotificationListOfAddressesCheckbox,
    getConservationAreaMapText,
    getListingDescriptionText,
    getOtherRelevantPoliciesText,
    getPlansUsedToReachDecisionText,
    getRepresentationsText,
    getStatutoryDevelopmentPlanText,
    getSupplementaryPlanningText
} from "../PageObjects/co-review-questionnaire-po";

export const reviewSectionMissingInformation = (missing_info, documentSection) => {
    if(missing_info.length ===0){
        if (documentSection === 'Plans used to reach decision')
            getPlansUsedToReachDecisionText()
                .should('be.visible');
        else if (documentSection === 'Statutory development plan policies')
            getStatutoryDevelopmentPlanText()
                .should('be.visible');
        else if (documentSection === 'Other relevant policies')
            getOtherRelevantPoliciesText()
                .should('be.visible');
        else if (documentSection === 'Supplementary planning documents')
            getSupplementaryPlanningText()
                .should('be.visible');
        else if (documentSection === 'Conservation area map and guidance')
            getConservationAreaMapText()
                .should('be.visible');
        else if (documentSection === 'Listing description'){
            if(cy.findByText('Would the development affect the setting of a listed building?').siblings('ul').contains('No')) {
            }else{
                getListingDescriptionText()
                    .should('be.visible');
            }
        }
        else if (documentSection === 'Application notification') {
            getApplicationNotification().click();
            getApplicationNotificationListOfAddressesCheckbox().should('exist');
            getApplicationNotificationCopyOfLetterCheckbox().should('exist');
        } else if (documentSection === 'Representations')
            getRepresentationsText()
                .should('be.visible');
        else if (documentSection === 'Appeal notification') {
            getAppealNotification().click();
            getAppealNotificationListOfAddressesCheckbox().should('exist');
            getAppealNotificationCopyOfLetterCheckbox().should('exist');

        }
    }else {
        if (documentSection === 'Plans used to reach decision')
            getPlansUsedToReachDecisionText()
                .should('be.visible')
                .type(missing_info);
        else if (documentSection === 'Statutory development plan policies')
            getStatutoryDevelopmentPlanText()
                .should('be.visible')
                .type(missing_info);
        else if (documentSection === 'Other relevant policies')
            getOtherRelevantPoliciesText()
                .should('be.visible')
                .type(missing_info);
        else if (documentSection === 'Supplementary planning documents')
            getSupplementaryPlanningText()
                .should('be.visible')
                .type(missing_info);
        else if (documentSection === 'Conservation area map and guidance')
            getConservationAreaMapText()
                .should('be.visible')
                .type(missing_info);
        else if (documentSection === 'Listing description') if(cy.findByText('Would the development affect the setting of a listed building?').siblings('ul').contains('No')) {
        }else{
            getListingDescriptionText()
                .should('be.visible')
                .type(missing_info);
        }
        else if (documentSection === 'Application notification') {
               getApplicationNotificationListOfAddressesCheckbox().click();
                getApplicationNotificationCopyOfLetterCheckbox().click();
        } else if (documentSection === 'Representations')
            getRepresentationsText()
                .should('be.visible')
                .type(missing_info);
        else if (documentSection === 'Appeal notification') {
                getAppealNotificationListOfAddressesCheckbox().click();
                getAppealNotificationCopyOfLetterCheckbox().click();

        }
    }
}