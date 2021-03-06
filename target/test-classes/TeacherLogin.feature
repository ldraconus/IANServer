
@tag
Feature: Teacher Login

  @tag1
  Scenario: Logging into IAN as a teacher
    Given I am at the login page
    When I enter a valid user name
    And I enter a valid password
    And I click the login button
    Then I will be on the Teacher page
 

  @tag2
  Scenario Outline: Title of your scenario outline
    Given I want to write a step with <name>
    When I check for the <value> in step
    Then I verify the <status> in step

    Examples: 
      | name  | value | status  |
      | name1 | Chris | success |
      | name2 | Sharon | Fail    |
