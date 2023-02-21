Feature: View and Edit a case from the Project Information Page as an Inspector

	Background: the user visits the homepage as an Inspector
		Given the user visits the home page
		Then the logged in user should be an Inspector

	@Inspector @smoke
	Scenario: Case Admins should be able view and edit the case
		Given the user searches for a case using its "Case Reference"
		And the user clicks the top search result
		And the user clicks the "Project information" link
		And the user clicks the "Show all sections" accordion
		Then the user should not be able to edit the case


