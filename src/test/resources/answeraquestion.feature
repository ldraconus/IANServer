
Feature: Answer a Question

  Scenario: Answer a question
  
    Given I am on the posted question page
    When I select a question to answer
    And I click Post
    Then Selected question will be answered

