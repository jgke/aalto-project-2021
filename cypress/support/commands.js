// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })W

Cypress.Commands.add('removeNodeDiv', (index, $div, $list) => {
    cy.wrap($div).click('topLeft', { force: true });
    cy.wrap($div).should('have.class', 'selected');
    cy.get('body').trigger('keydown', { key: "Backspace", charCode: 0, keyCode: 8 })
      .trigger('keyup', { key: "Backspace", charCode: 0, keyCode: 8 });
});

Cypress.Commands.add('insertNode', (nodeName) => {
    cy.get('input#nodetext').type(nodeName);
    cy.get('input#nodetext').parent().contains('Add').click();
});
