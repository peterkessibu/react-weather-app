describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173');
    //testing the testid
    cy.get('[data-testid="Weather-app"]')
    .should('have.text', 'Weather App')
    .should('exist')
  })
})