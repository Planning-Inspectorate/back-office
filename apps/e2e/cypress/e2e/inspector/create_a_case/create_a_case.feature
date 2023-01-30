Feature: Create New Case journey as an Inspector user

	Background: the user visits the home page as an Inspector
		Given the user visits the home page
		Then the logged in user should be an Inspector

	@Inspector @smoke
	Scenario: Inspector should not be able to create a new case - Create a new case button
		Then the user should not see the option to create a new case

	@Inspector @smoke
	Scenario: Inspector should not be able to create a new case - Navigating to page
		When the user navigates to the create a new case page
		Then the Inspector should not be able to view the create new case page
