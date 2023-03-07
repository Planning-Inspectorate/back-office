import { Then } from '@badeball/cypress-cucumber-preprocessor';
import { ApplicationsHomePage } from '../../../page_objects/applicationsHomePage';

const applicationHomePage = new ApplicationsHomePage();

Then(/^the user should not see the option to create a new case$/, function () {
	applicationHomePage.verifyCreateCaseIsNotAvailable();
});

Then(/^the Inspector should not be able to view the create new case page$/, function () {
	cy.contains('You are not permitted to access this URL.').should('exist');
});
