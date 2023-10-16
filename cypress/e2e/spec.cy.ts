describe('Landing page testing', () => {
  it('Visits the initial project page', () => {
    cy.visit('/');
    cy.contains('YOOX web app esta corriendo!');
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
    cy.contains('Error: Login failed, verify your credentials');
  });

  it('should return valid user data', () => {
    cy.visit('/login');
    cy.get('#design-login-email').type('supervisor');
    cy.get('#design-login-password').type('1');
    cy.get('.pt-3 > .font-semibold').click();
    cy.get('pre').should('contain', 'recordset');
  });
});
