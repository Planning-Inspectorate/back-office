Feature: View and Edit a case from the Project Information Page as a Case Admin user

	Background: the user visits the homepage as a case admin
		Given the user visits the home page
		Then the logged in user should be a Case Admin

	@CaseAdmin @smoke
	Scenario: Case Admins should be able view and edit the case
		When the user creates a new case
		Then the user checks their answers
		And the user completes the creation of the new case

