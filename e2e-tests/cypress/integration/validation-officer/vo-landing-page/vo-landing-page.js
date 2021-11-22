import {Given, When, Then} from "cypress-cucumber-preprocessor/steps";
import {headerLogo, appealHouseHolderLink,clickFeedBackLink,footerGovtLicence} from "../../../support/PageObjects/common-po";
import {
    validationOfficerLandingPage,
    validationOfficerPageTitle,
    tableHeaderAppealRef,
    tableHeaderReceivedOn,
    tableHeaderAppealSite,
    appealReference, appealDate, appealSite, receivedOndate,
} from '../../../support/PageObjects/vo-landing-page-po';
import {selectAppealIdForValidationOfficerFromDb} from "../../../support/db-queries/select-appeal-id-for-validation-officer-from-db";
import {dateFormat} from "../../../support/common/date-format";


Given('user is on the Validation Officer Login page', () => {
    validationOfficerLandingPage();
  });

Given('appeal submissions page is displayed', () => {
    validationOfficerLandingPage();
   });

// When('the login details are entered', () => {
//
// });

Then('appeal submissions page is displayed and page title and page header footer are verified', () => {
  validationOfficerLandingPage();
  cy.checkPageA11y();
  validationOfficerPageTitle();
  headerLogo();
  appealHouseHolderLink();
  clickFeedBackLink();
  footerGovtLicence();
});

Then("headers 'Appeal reference', 'Received on', 'Appeal site' are displayed", () => {
   tableHeaderAppealRef();
   tableHeaderReceivedOn();
   tableHeaderAppealSite();
});

Then('header contains the appeals data', () => {
    selectAppealIdForValidationOfficerFromDb();
    cy.get('@appealReferenceVO').then(appealReferenceVO => {
        let siteAddress = appealReferenceVO[19]+', '+appealReferenceVO[20]+', '+appealReferenceVO[21]+', '+appealReferenceVO[22]+', '+appealReferenceVO[23];
        let receivedOnDate = appealReferenceVO[15];
        cy.log(receivedOnDate);
        let appealReceivedDate = dateFormat(receivedOnDate,'DD MMMM YYYY');
        cy.log(appealReceivedDate);
        appealDate(appealReceivedDate).should("exist");
       // receivedOndate().siblings('td').should('contain',appealReceivedDate);
        console.log(appealReceivedDate);
        appealReference(appealReferenceVO[16]).should('exist');
        appealSite(siteAddress).should("exist");
          })
});