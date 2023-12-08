describe('Landing page testing', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.get('.logo').should('exist');
  });

  it('Visits the initial login page', () => {
    cy.visit('/login');
    cy.contains('Bienvenido');
  });

  it('should throw login error', () => {
    cy.visit('/login');
    cy.get('#design-login-email').type('test');
    cy.get('#design-login-password').type('1234');
    cy.get('.pt-3 > .font-semibold').click();
    cy.contains('Login failed, verify your credentials');
  });

  it('should return valid user data and token present on session storage', () => {
    cy.visit('/login');
    cy.get('#design-login-email').type('supervisor');
    cy.get('#design-login-password').type('1');
    cy.get('.pt-3 > .font-semibold').click();
    cy.url().should('include', '/pagos');

    // validates session storage token
    cy.window()
      .its('localStorage')
      .then((localStorage) => {
        const token = localStorage.getItem('token');
        expect(token).to.exist;
      });
  });
});
