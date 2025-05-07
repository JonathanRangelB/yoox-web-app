describe('Search loan request status for external users', () => {
    beforeEach(() => {
        cy.visit('/requeststatus');
    });

    it('Display not found data', () => {
        cy.contains('Ingresa los datos de tu solicitud');
        cy.get('[data-cy="loanrequestid"]').type('000001');
        cy.get('[data-cy="customerlastname"]').type('TTTTTT');
        cy.get('[data-cy="buscar"]').click();
        cy.contains('No se encontró información');
    });

    it('Display data found', () => {
        cy.get('[data-cy="loanrequestid"]').type('00001O');
        cy.get('[data-cy="customerlastname"]').type('MARTINEZ');
        cy.get('[data-cy="buscar"]').click();
        cy.contains('Estado: APROBADO');
    })

});