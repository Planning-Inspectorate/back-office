import {getSectionHeading} from "../PageObjects/co-check-and-confirm-po";

export const verifySectionName = (sectionName) =>{
    getSectionHeading()
        .should('exist')
        .should('contain',sectionName);
}