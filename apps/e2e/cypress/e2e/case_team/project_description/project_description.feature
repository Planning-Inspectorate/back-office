Feature: View and Edit a case from the Project Information Page as a Case Team user

	Background: the user visits the homepage as a case team user
		Given the user visits the home page
		Then the logged in user should be a Case Team user

	@CaseTeam @smoke
	Scenario: Case Team users should be able view and edit the case
		When the user creates a new case
		Then the user checks their answers
		And the user completes the creation of the new case

