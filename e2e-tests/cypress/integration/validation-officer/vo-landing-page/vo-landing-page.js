import {Given, When, Then} from "cypress-cucumber-preprocessor/steps";
import {headerLogo, appealHouseHolderLink,clickFeedBackLink,footerGovtLicence} from "../../../support/PageObjects/common-po";
import {
    caseOfficerLandingPage,
    caseOfficerPageTitle,
    tableHeaderAppealRef,
    tableHeaderReceivedOn,
    tableHeaderAppealSite,
    appealReference, appealDate,appealSite
    } from '../../../support/PageObjects/vo-landing-page-po';


Given('user is on the Validation Officer Login page', () => {
  caseOfficerLandingPage();
  });

Given('appeal submissions page is displayed', () => {
    caseOfficerLandingPage();
   });

When('the login details are entered', () => {

});

Then('appeal submissions page is displayed and page title and page header footer are verified', () => {
  caseOfficerLandingPage();
  cy.checkPageA11y();
  caseOfficerPageTitle();
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