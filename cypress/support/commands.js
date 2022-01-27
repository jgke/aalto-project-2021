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
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


// cypress is able to click the nodes even if they're outside the bounds as long as they are not covered by another node
Cypress.Commands.add('removeNodeDiv', (index, $div, $list) => {
    cy.wrap($div).click('topLeft', { force: true });
    cy.wrap($div).should('have.class', 'selected');
    cy.get('body').trigger('keydown', { key: "Backspace", charCode: 0, keyCode: 8 })
        .trigger('keyup', { key: "Backspace", charCode: 0, keyCode: 8 });
});

Cypress.Commands.add('insertNode', (nodeName) => {
    var b_NodeNamePrefixed = true;

    cy.get('input#nodetext').invoke('attr', 'value').should('eq', '');
    cy.get('input#nodetext').type(nodeName);
    cy.get('input#nodetext').invoke('attr', 'value').should('eq', nodeName);

    if (b_NodeNamePrefixed) {
        // nodeName should be prefixed by '__test__'
        expect(nodeName).match(/^__test__/);
    }
    cy.get('input#nodetext').parent().contains('Add').click();
});

// remove nodes prefixed with __test__
Cypress.Commands.add('removeAllTestNodes', () => {
    var nodeNamePrefix = '__test__';

    cy.get("body").then(($body) => {
        $body.find(`.react-flow__node-default:contains(${nodeNamePrefix})`).each((index, $div, $list) => {
            cy.removeNodeDiv(index, $div, $list);
        });
    });
});

Cypress.Commands.add('getElemRect', (elemString) => {
    let elem_pos = 0;

    cy.get(elemString).should('have.length', 1).then(
        ($elem) => {
            elem_pos = $elem[0].getBoundingClientRect();
        }
    );

    return elem_pos;
});
