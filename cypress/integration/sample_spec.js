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
        cy.get('input#nodetext');
    });
});

describe('nodetext has add button', () => {
    it('Has button to add node', () => {
        cy.get('input#nodetext').parent().contains('Add');
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

    it('Can rename nodes with double click', () => {
        const new_node_name = 'NEW NODE'
        cy.get('input#nodetext').type(node_name_1)
        cy.get('input#nodetext').parent().contains('Add').click()

        cy.get(`.react-flow__node-default:contains(${node_name_1})`).dblclick()
        cy.get('.react-flow__node input').type('{selectall}{backspace}' + new_node_name + '{enter}')

        cy.get(`.react-flow__node-default:contains(${new_node_name})`).should('exist')
        
        cy.get(`.react-flow__node-default:contains(${new_node_name})`)
            .trigger('keyup', {
                key: 'Backspace',
                charCode: 0,
                keyCode: 8
            })
            .trigger('keydown', {
                key: 'Backspace',
                charCode: 0,
                keyCode: 8
            })
        cy.get(`.react-flow__node-default:contains(${new_node_name})`).should('not.exist')
    })

    it('Can create nodes with ctrl click', () => {
        const new_node_name1 = 'NEW NODE 1'
        const new_node_name2 = 'NEW NODE 2'

        let node_pos1

        cy.get('.flow-wrapper').click('left', {ctrlKey: true})
        cy.get('.react-flow__node input').type(new_node_name1 + '{enter}')

        cy.get('.flow-wrapper').click('center', {ctrlKey: true})
        cy.get('.react-flow__node input').type(new_node_name2 + '{enter}')

        cy.get(`.react-flow__node-default:contains(${new_node_name1})`).then(
            ($node) => {
                node_pos1 = $node[0].getBoundingClientRect();

            }
        )

        cy.get(`.react-flow__node-default:contains(${new_node_name2})`).should(
            ($node) => {
                expect(node_pos1.x).lessThan($node[0].getBoundingClientRect().x);
            }
        )
    
        cy.get('.react-flow__node-default').each($node => {
            cy.wrap($node)
                .click()
                .trigger('keyup', {
                    key: 'Backspace',
                    charCode: 0,
                    keyCode: 8
                })
                .trigger('keydown', {
                    key: 'Backspace',
                    charCode: 0,
                    keyCode: 8
                })
        })
            
        cy.get(`.react-flow__node-default:contains(${new_node_name1})`).should('not.exist')
    })
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