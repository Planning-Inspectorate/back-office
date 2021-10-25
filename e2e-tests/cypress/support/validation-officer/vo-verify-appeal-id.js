import {appealReferenceValidation} from "../PageObjects/vo-invalid-appeal-details-po";

export const voVerifyAppealId = (appealId) => {
    appealReferenceValidation()
        .should('exist')
        .should('contain',appealId);
}