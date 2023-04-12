Feature: Upload files to a case as a Case Admin user

	Background: the user visits the homepage as a case admin
		Given the user visits the home page
		Then the logged in user should be a Case Admin

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
		And the user waits for the file to upload
		When the user downloads file "1" from the folder document page
		Then the file should have been downloaded
