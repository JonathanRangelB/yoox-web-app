describe('Landing page testing', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should create a valid loan request with existing customer', () => {
        cy.visit('/login');
        cy.get('[data-cy="username-input"]').type('KIKON');
        cy.get('[data-cy="password-input"]').type('1');
        cy.get('[data-cy="login-button"]').click();
        cy.get('.p-menubar-start > .p-element').click();

        cy.get('#pn_id_3_1_header > .p-panelmenu-header-content > .p-panelmenu-header-action').click();
        cy.get('#pn_id_3_1_0 > .p-menuitem-content > .p-menuitem-link').click();

        cy.get('#pn_id_18_0 > :nth-child(1) > .p-ripple').click()
        cy.get('#pn_id_18_0 > :nth-child(1) > .p-ripple').click()

        cy.get('#pn_id_18_0_0 > :nth-child(1) > .p-ripple').click()
        cy.get('#pn_id_18_0_0 > :nth-child(1) > .p-ripple').click()

        cy.get('#pn_id_18_0_0_0 > .p-menuitem-content > .p-ripple').click();

        cy.get('.p-dropdown-trigger').click()
        cy.get('#pn_id_35_3').click()

        cy.get('#pn_id_18_1 > :nth-child(1) > .p-ripple').click()
        cy.get('#pn_id_18_1 > :nth-child(1) > .p-ripple').click()

        cy.get('#pn_id_18_1_0 > :nth-child(1) > .p-ripple').click()
        cy.get('#pn_id_18_1_0 > :nth-child(1) > .p-ripple').click()

        cy.get('#pn_id_18_1_0_0 > .p-menuitem-content > .p-ripple').click()

        cy.get(':nth-child(1) > .sm\\:flex-row > .md\\:align-items-center > .flex-column > .flex > p-button.p-element > .p-ripple').click();

        cy.contains('Registro encontrado!')
        cy.get('.p-toast-message-content > .p-ripple').click();

        cy.get('#pn_id_582_3_header_action > .p-stepper-title').click()

        cy.get('.mt-3 > .p-element.ng-star-inserted > .p-ripple').click();
        cy.contains('El status nuevo será: APROBADO')
        cy.get('.justify-content-between > .p-element.ng-star-inserted > .p-ripple').click()

        cy.get('.p-confirm-dialog-accept').click();
        cy.contains('La solicitud fue creada. Redirigiendo a listado')

    });

});