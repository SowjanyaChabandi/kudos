Cypress.Commands.add('login', (username, password) => {
    cy.visit('/');
    cy.get('input[placeholder="Enter username"]').type("sowjanya");
    cy.get('input[placeholder="Enter password"]').type("sowjanya123");
    cy.get('button').contains('Login').click();
    cy.contains(`Welcome, ${username}!`).should('exist');
  });
  