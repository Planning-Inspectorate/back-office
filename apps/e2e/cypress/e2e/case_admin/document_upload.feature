Feature: Upload files to a case as a Case Admin user

	Background: the user visits the homepage as a case admin
		Given the user visits the home page

	@CaseAdmin @smoke @InitCaseInfo @CreateCaseForTest
	Scenario: Case Admins should be able upload files to a case
		When the user searches for the current case
		And the user clicks the top search result
		Then the user should validate the summary page with file "1" and "complete" data
		When the user clicks the "Update project information" link
		And the user clicks the "Project documentation" link
		And the user clicks the "Project management" link
		And the user clicks the "Upload files" button
		When the user uploads a file
		And the user clicks the "Save and continue" button
		Then the folder should have "1" document


	@Inspector @smoke
	Scenario: Inspector should not be able to upload files to a case
		Given the user visits the home page
		When the user searches for the current case
		And the user clicks the top search result
		Then the user should validate the summary page with file "1" and "complete" data
		And the user clicks the "Project documentation" link
		And the user clicks the "Project management" link
		Then the user should not see the "Upload files" button
		And the folder should have "1" document

