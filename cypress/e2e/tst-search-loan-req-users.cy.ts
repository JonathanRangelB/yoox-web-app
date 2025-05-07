describe('Landing page testing', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should return valid loan request', () => {
        cy.visit('/login');
        cy.get('[data-cy="username-input"]').type('supervisor');
        cy.get('[data-cy="password-input"]').type('1');
        cy.get('[data-cy="login-button"]').click();
        cy.get('.p-menubar-start > .p-element').click();
        cy.get('#pn_id_3_1_header > .p-panelmenu-header-content > .p-panelmenu-header-action').click();
        cy.get('#pn_id_3_1_0 > .p-menuitem-content > .p-menuitem-link').click();
        cy.get('[ng-reflect-icon="pi pi-user"] > .p-ripple').click();
        cy.get('#search').type('00001Q');
        cy.get('[icon="pi pi-search"] > .p-ripple').click();
        cy.get('[icon="pi pi-file-edit"] > .p-ripple').eq(0).click()
        cy.contains('Folio de solicitud: 00001Q');

    });

});