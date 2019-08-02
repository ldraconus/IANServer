
Feature: Delete Question

  Scenario: Delete a Question
    Given I am on the Posted Questions page
		When I select a question to delete
		And I click Confirm delete 
		Then The selected question(s) will be deleted

