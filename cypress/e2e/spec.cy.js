describe("template spec", () => {
  it("passes", () => {
    cy.visit("http://localhost:5173");
    //testing the testid
    cy.get('[data-testid="Weather-app"]')
      .should("have.text", "Weather App")
      .should("exist");

    cy.get('[data-testid="Autocomplete"]').should("exist");
  });

  it("Testing the text field", () => {
    cy.visit("http://localhost:5173");

    cy.get('[data-testid="TextField"] input')
      .should("exist")
      .type("London")
      .should("have.value", "London");
  });

  it("Testing the Current Weather", () => {
    cy.visit("http://localhost:5173");

    //Get the API request
    cy.intercept("GET", "**/data/2.5/weather*");
    cy.get('[data-testid="TextField"] input')
      //automate test with London
      .type("London, GB{enter}")
      .should("have.value", "London, GB");

    //test for all details in current weather
    cy.get('[data-testid="current_weather-temperature"]').should("exist");

    cy.get('[data-testid="current_weather-humidity"]').should("exist");

    cy.get('[data-testid="current_weather-temperature"]').should("exist");

    cy.get('[data-testid="current_weather-description"]').should("exist");

    cy.get('[data-testid="current_weather-wind"]').should("exist");
  });

  //test for all forecast details
  it("Testing Forecast Section", () => {
    cy.visit("http://localhost:5173");

    cy.intercept("GET", "**/data/2.5/forecast*");

    cy.get('[data-testid="TextField"] input')
      .type("London, GB{enter}")
      .should("have.value", "London, GB");

    cy.get('[data-testid="Forecast"]').should("contain.text", "5-Day Forecast");

    cy.get('[data-testid="forecast-card"]').should("exist");

    cy.get('[data-testid="forecast-day"]').should("exist");

    cy.get('[data-testid="forecast-date"]').should("exist");

    cy.get('[data-testid="forecast-min-temp"]').should("exist");

    cy.get('[data-testid="forecast-max-temp"]').should("exist");

    cy.get('[data-testid="forecast-description"]').should("exist");
  });
});
