import {Given, When, Then} from "cypress-cucumber-preprocessor/steps";
import {headerLogo, appealHouseHolderLink,clickFeedBackLink,footerGovtLicence} from "../../../support/PageObjects/common-po";
import {
    validationOfficerLandingPage,
    validationOfficerPageTitle,
    tableHeaderAppealRef,
    tableHeaderReceivedOn,
    tableHeaderAppealSite,
    appealReference, appealDate, appealSite,
} from '../../../support/PageObjects/vo-landing-page-po';


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
    appealReference();
    appealDate();
    appealSite();
});