Feature: Opening the help screen

  Scenario: As a user I want to be able to open the help screen from the side menu the first time I open the app
    Given I see the text "Log in"
    Then I press the "BE ANONYMOUS" button            
    And I touch the "Front Page" text
    And I wait for progress
    Then I should see "reddit.com/hot"