import {Given, When} from "cypress-cucumber-preprocessor/steps";
import {
    appealCaseReferenceCST,
    appealSiteAddressBody,
    appealSiteAddressCST,
    appellantNameCST,
    inputSearchbox,
    visitSearchPage
} from "../../../support/PageObjects/cst-search-page-po";
import {continueButton} from "../../../support/PageObjects/common-po";
import {selectCaseDetailsSearchPageFromDb} from "../../../support/db-queries/select-case-details-search-page";
let textSearch = '22';
let postCode = 'RG';

Given( 'Customer Support Team is on the search dashboard page', () => {
    visitSearchPage();
} );
When( "the user enter {string} and click on Search button", (data) => {
    inputSearchbox().type(data);
    continueButton().click();
} );
Then( 'the results page is displayed with the data matching the search criteria', () => {
    selectCaseDetailsSearchPageFromDb();
    cy.get( '@caseReferenceCST' ).then( caseReferenceCST => {
        let siteAddressCST = caseReferenceCST[19]+', '+caseReferenceCST[20]+', '+caseReferenceCST[21]+', '+caseReferenceCST[22]+', '+caseReferenceCST[23];
        appealCaseReferenceCST( caseReferenceCST[16] ).should( 'exist' );
        appellantNameCST(caseReferenceCST[18]).should('exist');
        appealSiteAddressCST().contains('th', 'Site address').should('be.visible');
        appealSiteAddressBody().should('contain',siteAddressCST).should('be.visible');
    });
} );


