import {Given, When} from "cypress-cucumber-preprocessor/steps";
import {appealCaseReferenceCST, inputSearchbox, visitSearchPage} from "../../../support/PageObjects/cst-search-page-po";
import {continueButton} from "../../../support/PageObjects/common-po";
import {
    pageAppealDetailsTitle,
    pageSearchResultsTitle,
    viewAppealDetailsPage, viewAppealSiteAddress
} from "../../../support/PageObjects/cst-appeal-details-po";
import {selectCaseDetailsSearchPageFromDb} from "../../../support/db-queries/select-case-details-search-page";
import {
    changeLinkSiteAddress, errorOnLabelAddressLine1, errorOnLabelPostCode, errorSummaryTitle,
     inputAddressLine1, inputAddressLine2, inputCounty, inputPostcode, inputTownCity,
    pageSiteAddress
} from "../../../support/PageObjects/cst-edit-site-address-po";
import {verifyPageTitle} from "../../../support/common/verify-page-title";
import {verifyErrorMessage} from "../../../support/common/verify-error-message";
import {validateSiteAddress} from "../../../support/common/validate-site-address";
const pageTitle = 'Change address of the appeal site - Appeal a householder planning decision - GOV.UK';

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
});
When( "the user selects site address in the summary section", () => {
    changeLinkSiteAddress().click();
});
Then( "the 'Change address of appeal site' page will be displayed", () => {
    pageSiteAddress();
    verifyPageTitle(pageTitle);
});

Given('the user is on the Site Address change page', () => {
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
    changeLinkSiteAddress().click();
    pageSiteAddress();
});
When('the user edits information and saves', () => {
    inputAddressLine1().clear().type('11');
    inputAddressLine2().clear().type('London Street');;
    inputTownCity().clear().type('Reading');
    inputCounty().clear().type('Berkshire');
    inputPostcode().clear().type('RG1 2BC');
    continueButton().click();
});
Then('the user can see the site address has been updated with correct information', () => {
    viewAppealDetailsPage();
    selectCaseDetailsSearchPageFromDb();
    cy.get( '@caseReferenceCST' ).then( caseReferenceCST => {
        let siteAddressCST = caseReferenceCST[19] + ', ' + caseReferenceCST[20] + ', ' + caseReferenceCST[21] + ', ' + caseReferenceCST[22] + ', ' + caseReferenceCST[23];
        viewAppealSiteAddress().contains( 'dd', siteAddressCST ).should( 'be.visible' );
    });
});

When("the user enters {string} and {string} and {string} and {string} and {string}", (addr1,addr2,town,county,postcode,errorMessage) => {
   validateSiteAddress(addr1,addr2,town,county,postcode);
    continueButton().click();
    })
Then('the validation error message {string} displayed', (errorMessage) => {
    cy.log('error message is => '+errorMessage);
    let errorMessages = errorMessage.split( ',' );
    errorMessages.forEach(em => {
        if(em.includes('address'))
            verifyErrorMessage( em, errorSummaryTitle, errorOnLabelAddressLine1 );
        else
            verifyErrorMessage( em, errorSummaryTitle, errorOnLabelPostCode );
    });
});

