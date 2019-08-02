
Feature: Logout


  Scenario: Logout of IAN
  Given I am on any page except the login page
	When  I close the browser window
	Then  I am logged out of the app

  