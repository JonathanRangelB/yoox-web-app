describe('Landing page testing', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.get('.logo').should('exist');
  });

  it('Visits the initial login page', () => {
    cy.visit('/login');
    cy.contains('Ingresa tus credenciales');
  });

  it('should throw login error', () => {
    cy.visit('/login');
    cy.get('[data-cy="username-input"]').type('test');
    cy.get('[data-cy="password-input"]').type('1234');
    cy.get('[data-cy="login-button"]').click();
    cy.contains('Login failed, verify your credentials');
  });

  it('should return valid user data and token present on session storage', () => {
    cy.visit('/login');
    cy.get('[data-cy="username-input"]').type('supervisor');
    cy.get('[data-cy="password-input"]').type('1');
    cy.get('[data-cy="login-button"]').click();
    cy.url().should('include', '/pagos');

    // validates session storage token
    cy.window()
      .its('localStorage')
      .then((localStorage) => {
        const token = localStorage.getItem('token');
        expect(token).to.exist;
      });
  });

  it('Should look for a loan and return a list of payments', () => {
    cy.visit('/login');
    cy.get('[data-cy="username-input"]').type('supervisor');
    cy.get('[data-cy="password-input"]').type('1');
    cy.get('[data-cy="login-button"]').click();

    cy.get('#withoutgrouping').type('8509');
    cy.get('[data-cy="buscar-button"]').click();
    cy.get(':nth-child(1) > .xl\\:flex-row').should('exist');
  });
});
