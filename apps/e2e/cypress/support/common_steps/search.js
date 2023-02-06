// @ts-nocheck
import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { ApplicationsHomePage } from '../../page_objects/applicationsHomePage';
import { SearchResultsPage } from '../../page_objects/searchResultsPage';

const applicationsHomePage = new ApplicationsHomePage();
const searchResultsPage = new SearchResultsPage();

Then('the user should see the search cases section', function () {
	applicationsHomePage.verifySearchSection();
});

Then('the user should get {string} matching cases in the results', function (count) {
	searchResultsPage.verifySearchResultsCount(count);
});

Then('the user should get some results from the search', function (count) {
	searchResultsPage.verifySearchResultsCount();
});

Then('the user should see the {string} error', function (errorText) {
	searchResultsPage.verifySearchError(errorText);
});

Then('the top search result should be {string}', function (caseResultName) {
	searchResultsPage.verifyTopSearchResultName(caseResultName);
});

When('the user searches for a case using its {string}', function (searchWithType) {
	cy.fixture('case-search').then((json) => {
		switch (searchWithType) {
			case 'Case Reference':
				applicationsHomePage.searchFor(json.caseRef, true);
				break;
			case 'Case Name':
				applicationsHomePage.searchFor(json.caseName);
				break;
			case 'Case Description':
				applicationsHomePage.searchFor(json.caseDescription);
				break;
			default:
				throw new Error(
					"Only 'Case Reference', 'Case Name', 'Case Description', 'Empty string' are allowed"
				);
		}
	});
});

When('the user searches for {string}', function (searchTerm) {
	applicationsHomePage.searchFor(searchTerm);
});
