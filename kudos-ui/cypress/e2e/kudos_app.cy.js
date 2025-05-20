describe('Kudos App Tests', () => {
    const username = 'sowjanya';
    const password = 'sowjanya123';
  
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('logs in successfully', () => {
      cy.get('input[placeholder="Enter username"]').type(username);
      cy.get('input[placeholder="Enter password"]').type(password);
      cy.get('button').contains('Login').click();
  
      cy.contains(`Welcome, ${username}!`).should('exist');
    });
  
    it('displays available users after login', () => {
      cy.login(username, password);
      cy.get('select#receiver').should('exist');
      cy.get('option').should('have.length.greaterThan', 1);
    });
  
    it('sends a kudo successfully', () => {
      cy.login(username, password);
  
      cy.get('select#receiver').select(1); // Select second user in dropdown
      cy.get('textarea#message').type('Great work!');
      cy.get('button').contains('Send Kudo').click();
  
      cy.on('window:alert', (txt) => {
        expect(txt).to.contains('Kudo sent successfully!');
      });
    });
  
    it('displays received kudos', () => {
      cy.login(username, password);
      cy.get('.kudo-list li').should('exist');
    });
  
    it('logout functionality works', () => {
      cy.login(username, password);
      cy.get('button').contains('Logout').click();
      cy.get('form.login-form').should('exist');
    });
  });
