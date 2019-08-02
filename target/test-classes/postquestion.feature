Feature: Post Question

  Scenario: Post Question
  	Given I am on the Post question page
		When I enter my name
		And I enter a question
		And I select a ranking star
		And I click the next button
		Then The question successfully posts

  
