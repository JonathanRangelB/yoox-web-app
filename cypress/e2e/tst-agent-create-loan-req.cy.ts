describe('Landing page testing', () => {
    beforeEach(() => {
        cy.visit('/login');
    });

    it('should create a valid loan request with existing customer', () => {
        cy.visit('/login');
        cy.get('[data-cy="username-input"]').type('IRMA');
        cy.get('[data-cy="password-input"]').type('1');
        cy.get('[data-cy="login-button"]').click();
        cy.get('.p-menubar-start > .p-element').click();
        cy.get('#pn_id_3_0_1 > .p-menuitem-content > .p-menuitem-link').click();

        cy.get('#cantidad_prestada').type('27000');
        cy.get('#pn_id_18 > .p-dropdown-trigger').click();
        cy.get('#pn_id_18_0').click();
        cy.get('#fecha_inicial').click();
        cy.get('[ng-reflect-label="Today"]').click();
        cy.get('.justify-content-end > p-button.p-element > .p-ripple').click();

        cy.get('.p-inputswitch-slider').click();
        cy.get('#ID').type('6472');
        cy.get('[style="margin: 0 auto; margin-top: 10px;"] > .p-button').click()

        cy.get('.p-datatable-tbody > .p-element > :nth-child(1)').click()
        cy.get('#nombre_cliente').clear()
        cy.get('#nombre_cliente').type('MONICA');
        cy.get('#apellido_paterno_cliente').type('CHAVEZ')
        cy.get('#apellido_materno_cliente').type('CAMARILLO')
        cy.get('#correo_electronico_cliente').type('mchavez@mymail.com.mx')
        cy.get('#referencias_dom_cliente').type('Casa verde menta-azul menta')
        cy.get('#pn_id_12_1_content > .justify-content-between > [label="Siguiente"] > .p-ripple').click()

        cy.get('#nombre_aval').clear();
        cy.get('#nombre_aval').type('RIGOBERTO');

        cy.get('#apellido_paterno_aval').type('VALDEZ')
        cy.get('#apellido_materno_aval').type('CHAVEZ')
        cy.get('#correo_electronico_aval').type('rigoberto@soytuaval.com.mx')
        cy.get('#referencias_dom_aval').type('Casa de ladrillos y enrejado')
        cy.get('#pn_id_12_2_content > .justify-content-between > [label="Siguiente"] > .p-ripple').click()

        cy.get('#observaciones').type('Pendiente documentación')

        cy.get('.justify-content-between > .p-element.ng-star-inserted > .p-ripple').click()
        cy.get('.p-confirm-dialog-accept').click()
        cy.contains('Cambios realizados');

    });

});