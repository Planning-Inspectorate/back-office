import {
    getAppealNotification,
    getApplicationNotification,
    getApplicationPublicity,
    getConservationAreaMapAndGuidance,
    getDecisionNotice,
    getOtherRelevantPolicies,
    getPlanningOfficersReport,
    getPlansUsedToReachDecision,
    getRepresentations,
    getStatutoryDevelopmentPlanPolicy,
    getSupplementaryPlanningDocuments
} from "../PageObjects/co-review-questionnaire-po";

export const reviewSectionDocumentList = (documentName, documentSection) => {
    if (documentSection === 'Decision notice')
        getDocument(documentName, getDecisionNotice());
    else if (documentSection === `Planning Officer's report`)
        getDocument(documentName,getPlanningOfficersReport());
    else if (documentSection === 'Plans used to reach decision')
        getDocument(documentName,getPlansUsedToReachDecision());
    else if (documentSection === 'Statutory development plan policies')
        getDocument(documentName,getStatutoryDevelopmentPlanPolicy());
    else if(documentSection === 'Other relevant policies')
        getDocument(documentName,getOtherRelevantPolicies());
    else if(documentSection === 'Supplementary planning documents')
        getDocument(documentName, getSupplementaryPlanningDocuments());
    else if(documentSection === 'Conservation area map and guidance')
        getDocument(documentName,getConservationAreaMapAndGuidance());
    else if(documentSection === 'Application notification')
        getDocument(documentName,getApplicationNotification());
    else if(documentSection === 'Application publicity')
        getDocument(documentName,getApplicationPublicity());
    else if(documentSection === 'Representations')
        getDocument(documentName, getRepresentations());
    else if(documentSection === 'Appeal notification')
        getDocument(documentName,getAppealNotification());
}

  function getDocument(documentName,documentSectionObject) {
        documentSectionObject.siblings()
            .contains(documentName)
            .should("exist")
            .should('have.attr','href');
    }