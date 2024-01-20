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
    cy.get(
      ':nth-child(1) > .ui-grid-col-6 > .p-input-icon-right > .p-inputtext'
    ).type('test');
    cy.get('.mt-3 > .ui-grid-col-6 > .p-input-icon-right > .p-inputtext').type(
      '1234'
    );
    cy.get(':nth-child(3) > .ui-grid-col-6 > .p-element').click();
    cy.contains('Login failed, verify your credentials');
  });

  it('should return valid user data and token present on session storage', () => {
    cy.visit('/login');
    cy.get(
      ':nth-child(1) > .ui-grid-col-6 > .p-input-icon-right > .p-inputtext'
    ).type('supervisor');
    cy.get('.mt-3 > .ui-grid-col-6 > .p-input-icon-right > .p-inputtext').type(
      '1'
    );
    cy.get(':nth-child(3) > .ui-grid-col-6 > .p-element').click();
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
    cy.get(
      ':nth-child(1) > .ui-grid-col-6 > .p-input-icon-right > .p-inputtext'
    ).type('supervisor');
    cy.get('.mt-3 > .ui-grid-col-6 > .p-input-icon-right > .p-inputtext').type(
      '1'
    );
    cy.get(':nth-child(3) > .ui-grid-col-6 > .p-element').click();

    cy.get('#withoutgrouping').type('8509');
    cy.get('.p-button').click();
    cy.get(':nth-child(1) > .xl\\:flex-row').should('exist');
  });
});
