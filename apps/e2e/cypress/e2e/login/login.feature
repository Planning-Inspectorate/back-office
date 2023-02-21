Feature: Visit the homepage

	Background: The user visits the home page
		Given the user visits the home page

	@CaseAdmin @smoke
	Scenario: Log in as a Case Admin Officer
		Then the logged in user should be a Case Admin

	@CaseTeam @smoke
	Scenario: Log in as a Case Team Member
		Then the logged in user should be a Case Team member

	@Inspector @smoke
	Scenario: Log in as an Inspector
		Then the logged in user should be an Inspector
