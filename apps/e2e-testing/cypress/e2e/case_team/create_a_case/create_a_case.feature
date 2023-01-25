Feature: Create New Case journey as an Case Team user

	Background: the user visits the homepage as a case team user
		Given the user visits the home page
		Then the logged in user should be a Case Team user

	@CaseTeam @smoke
	Scenario: Case Team user should be able to create a new case
		When the user starts the creation of a new case
		And the user enters a name and description for the new case
		And the user clicks the "Save and continue" button
		Then the user validates previous page
		Then the user should see 6 radio options to choose on the page
		When the user chooses option 1 radio button
		And the user clicks the "Save and continue" button
		Then the user validates previous page
		Then the user should see 9 radio options to choose on the page
		When the user chooses option 3 radio button
		And the user clicks the "Save and continue" button
		Then the user validates previous page
		And the user enters geographical information for the new case
		And the user clicks the "Save and continue" button
		Then the user validates previous page
		Then the user should see 10 checkboxes options to choose on the page
		When the user chooses option 1 checkbox
		And the user chooses option 2 checkbox
		And the user chooses option 5 checkbox
		And the user clicks the "Save and continue" button
		# Then the user validates previous page
		Then the user should see 9 radio options to choose on the page
		When the user chooses option 2 radio button
		And the user clicks the "Save and continue" button
		Then the user validates previous page
		And the user enters the case team email address for the new case
		And the user clicks the "Save and continue" button
		Then the user validates previous page
		Then the user should see 6 checkboxes options to choose on the page
		When the user chooses option 1 checkbox
		And the user chooses option 2 checkbox
		And the user chooses option 3 checkbox
		And the user chooses option 4 checkbox
		And the user chooses option 5 checkbox
		And the user chooses option 6 checkbox
		And the user clicks the "Save and continue" button
		Then the user validates previous page
		When the user enters the applicant's organisation name for the new case
		And the user clicks the "Save and continue" button
		Then the user validates previous page
		And the user enters the applicant's first and last name for the new case
		And the user clicks the "Save and continue" button
		Then the user validates previous page
		When the user enters the applicant's postcode as "BS1 6PN"
		And the user clicks the "Find address" button
		And the user selects option 2 from the "Address" list
		And the user clicks the "Save and continue" button
		# Then the user validates previous page
		When the user enters the applicant's website for the new case
		And the user clicks the "Save and continue" button
		Then the user validates previous page
		And the user enters the applicant's email for the new case
		And the user clicks the "Save and continue" button
		Then the user validates previous page
		When the user enters the applicant's phone number for the new case
		And the user clicks the "Save and continue" button
		Then the user validates previous page
		And the user enters "Q4 2026" into the key dates anticipated submission date input
		And the user enters "01" "12" "2026" into the key dates internal anticipated submission date input
		And the user clicks the "Save and continue" button
		And the user clicks the "I accept - confirm creation of a new case" button
		Then the user should confirm that a new case has been created

