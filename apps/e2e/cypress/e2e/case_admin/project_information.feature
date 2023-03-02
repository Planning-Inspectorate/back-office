Feature: View and Edit a case from the Project Information Page as a Case Admin user

	Background: the user visits the homepage as a case admin
		Given the user visits the home page
		Then the logged in user should be a Case Admin

	@CaseAdmin @smoke @InitCaseInfo @CreateCaseForTest
	Scenario: Case Admins should be able view and edit the case  - Filling all available options in the form
		When the user searches for the current case
		And the user clicks the top search result
		Then the user should validate the summary page with file 1 and complete data
		When the user clicks the "Update project information" link
		And the user clicks the "Show all sections" accordion
		Then the user should validate the Project information page with file 1 and complete data
		When the user updates the project information with file 2
		Then the user should validate the Project information page with file 2 and complete data
		When the user clicks the "Preview and publish project" link
		Then the user should validate the Preview and Publish page with file 2 and complete data
		When the user clicks the "Accept and publish project" button
		Then the user should see a banner message displaying "Project page published"
