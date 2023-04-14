Feature: Upload files to a case as a Case Admin user

	@CaseAdmin @smoke @InitCaseInfo @CreateCaseForTest
	Scenario: CreateCaseForTest
		When the user goes to the dashboard


	@Inspector @smoke
	Scenario: Inspector should not be able to upload files to a case
		Given the user visits the home page
		When the user searches for the current case
		And the user clicks the top search result
		Then the user should validate the summary page with file "1" and "complete" data
		And the user clicks the "Project documentation" link
		And the user clicks the "Project management" link
		Then the user should not see the "Upload files" button


