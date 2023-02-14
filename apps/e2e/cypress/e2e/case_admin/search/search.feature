Feature: Verify Search Functionality as a Case Admin user

	Background: the user visits the homepage as a Case Admin user
		Given the user visits the home page
		Then the logged in user should be a Case Admin
		And the user should see the search cases section

	@CaseAdmin @smoke
	Scenario: Case Admin user should be able to use search using Case Reference- Open Cases
		Given the user searches for a case using its "Case Reference"
		Then the user should get "1" matching cases in the results
		And the top search result should be "BC0110001 - Office Use Test Application 1"

	@CaseAdmin @smoke
	Scenario: Case Admin user should be able to use search using Case Name - Open Cases
		Given the user searches for a case using its "Case Name"
		Then the user should get "1" matching cases in the results
		And the top search result should be "BC0110001 - Office Use Test Application 1"

	@CaseAdmin @smoke
	Scenario: Case Admin user should be able to use search using Case Description - Open Cases
		Given the user searches for a case using its "Case Description"
		Then the user should get "1" matching cases in the results
		And the top search result should be "BC0110001 - Office Use Test Application 1"


	@CaseAdmin @smoke
	Scenario: Case Admin user should see an error when nothing is entered - Open Cases
		Given the user searches for " "
		Then the user should see the "Enter a search term" error


	@CaseAdmin @smoke
	Scenario: Case Admin user should see some results when a correct search term is entered - Open Cases
		Given the user searches for "TR"
		Then the user should get some results from the search

