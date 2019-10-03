describe('color-palett', function () {
  it('Visits color-palette and generates colors twice', function () {
    cy.visit('https://todoist.com/')
    cy.get('.sel_login').click();
    cy.wait(500)
    cy.screenshot("first");
    cy.wait(500)
    cy.screenshot("second");
    cy.wait(500)
    cy.screenshot("second");
  })
})
