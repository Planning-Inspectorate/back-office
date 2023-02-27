Feature: Verify Search Functionality as a Inspector user

	Background: the user visits the homepage as a Inspector user
		Given the user visits the home page
		Then the logged in user should be an Inspector
		And the user should see the search cases section

	@Inspector @smoke
	Scenario: Inspector user should be able to use search using Case Reference- Open Cases
		Given the user searches for a case using its "Case Reference"
		Then the user should get "1" matching cases in the results
		And the top search result should be "BC0110001 - Office Use Test Application 1"

	@Inspector @smoke
	Scenario: Inspector user should be able to use search using Case Name - Open Cases
		Given the user searches for a case using its "Case Name"
		Then the user should get "1" matching cases in the results
		And the top search result should be "BC0110001 - Office Use Test Application 1"

	@Inspector @smoke
	Scenario: Inspector user should be able to use search using Case Description - Open Cases
		Given the user searches for a case using its "Case Description"
		Then the user should get "1" matching cases in the results
		And the top search result should be "BC0110001 - Office Use Test Application 1"


	@Inspector @smoke
	Scenario: Inspector user should see an error when nothing is entered - Open Cases
		Given the user searches for " "
		Then the user should see the "Enter a search term" error


	@Inspector @smoke
	Scenario: Inspector user should get some result with a general search - Open Cases
		Given the user searches for "TR"
		Then the user should get some results from the search

