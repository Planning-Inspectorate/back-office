Feature: Visit the homepage

	Background: The user visits the home page
		Given the user visits the home page

	@CaseAdmin
	Scenario: Log in as a Case Admin Officer
		Then the logged in user should be a Case Admin

	@CaseTeam
	Scenario: Log in as a Case Team Member
		Then the logged in user should be a Case Team user

	@Inspector
	Scenario: Log in as an Inspector
		Then the logged in user should be an Inspector

