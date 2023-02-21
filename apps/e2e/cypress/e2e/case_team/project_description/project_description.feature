Feature: View and Edit a case from the Project Information Page as a Case Team member

	Background: the user visits the homepage as a case team member
		Given the user visits the home page
		Then the logged in user should be a Case Team member

	@CaseTeam @smoke @CreateCaseForTest
	Scenario: Case Admins should be able view and edit the case
		When the user searches for the current case
		And the user clicks the top search result
		Then the user should validate the summary page with file 1
		When the user clicks the "Update project information" link
		And the user clicks the "Show all sections" accordion
		Then the user should validate the "Project Information" page with file 1
		When the user updates the project information with file 2
		Then the user should validate the "Project Information" page with file 2
		When the user clicks the "Preview and publish project" link
		Then the user should validate the "Preview and Publish" page with file 2

