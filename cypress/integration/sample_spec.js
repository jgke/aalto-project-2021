describe('Passing Dummy Test', () => {
    it('Does not do much', () => {
        expect(true).to.equal(true)
    });
});

describe('Test A', () => {
    it('Visit page', () => {
        cy.visit('http://localhost:3000')
    });
});

describe('Has nodetext', () => {
    it('Has an input to enter node name', () => {
        cy.get('input#nodetext')
    });
});

describe('nodetext has add button', () => {
    it('Has button to add node', () => {
        cy.get('input#nodetext').parent().contains('Add')
    });
});

describe('test add node', () => {
    it('Can add and remove nodes', () => {
        let node_name_1 = '__test__1';
        let node_name_2 = '__test__2';
        let node_n1 = 3;

        // remove nodes prefixed with __test__
        cy.removeAllTestNodes();

        cy.get(`.react-flow__node-default:contains(${node_name_1})`).should('not.exist');
        cy.get(`.react-flow__node-default:contains(${node_name_2})`).should('not.exist');
        
        cy.insertNode(node_name_1);

        cy.get(`.react-flow__node-default:contains(${node_name_1})`).should('exist');

        for (let i = 0; i < node_n1; i++) {
            cy.insertNode(node_name_1);
        }

        cy.get(`.react-flow__node-default:contains(${node_name_1})`).should('exist');
        cy.get(`.react-flow__node-default:contains(${node_name_2})`).should('not.exist');

        cy.insertNode(node_name_2);

        cy.get(`.react-flow__node-default:contains(${node_name_1})`).should('exist');
        cy.get(`.react-flow__node-default:contains(${node_name_2})`).should('exist');

        cy.removeAllTestNodes();

        cy.get(`.react-flow__node-default:contains(${node_name_1})`).should('not.exist');
        cy.get(`.react-flow__node-default:contains(${node_name_2})`).should('not.exist');

    });
});

describe('test add edge', () => {
    it('Can add and remove edges', () => {
        let node_name_1 = '__test__1';
        let node_name_2 = '__test__2';

        cy.removeAllTestNodes();

        cy.get(`.react-flow__node-default:contains(${node_name_1})`).should('not.exist');
        cy.get(`.react-flow__node-default:contains(${node_name_2})`).should('not.exist');
        
        cy.insertNode(node_name_1);
        cy.insertNode(node_name_2);

        cy.get(`.react-flow__node-default:contains(${node_name_1})`).should('exist');
        cy.get(`.react-flow__node-default:contains(${node_name_2})`).should('exist');

        cy.get('.react-flow__edge-straight').should('have.length', 0);

        cy.get(`.react-flow__node-default:contains(${node_name_2})`).find('.react-flow__handle-bottom').should('have.length', 1).trigger('mousedown');

        cy.get(`.react-flow__node-default:contains(${node_name_1})`).find('.react-flow__handle-top').should('have.length', 1).trigger('mouseup');


        cy.get('.react-flow__edge-straight').should('have.length', 1);

        cy.removeAllTestNodes();

        cy.get(`.react-flow__node-default:contains(${node_name_1})`).should('not.exist');
        cy.get(`.react-flow__node-default:contains(${node_name_2})`).should('not.exist');

    });
});
