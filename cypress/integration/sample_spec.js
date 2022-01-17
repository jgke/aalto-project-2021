describe('Passing Dummy Test', () => {
  it('Does not do much', () => {
    expect(true).to.equal(true)
  })
})

describe('Test A', () => {
  it('Visit page', () => {
    cy.visit('http://localhost:3000')
  })
})

describe('Has nodetext', () => {
  it('Has an input to enter node name', () => {
    cy.get('input#nodetext')
  })
})

describe('nodetext has add button', () => {
  it('Has button to add node', () => {
    cy.get('input#nodetext').parent().contains('Add')
  })
})

describe('test add node', () => {
  it('Can add and remove nodes', () => {
    let node_name_1 = '__test__1'
    let node_name_2 = '__test__2'
    let node_n1 = 3;

    // remove pre-existing nodes with the test name
    cy.get("body").then(($body) => {
      $body.find(`.react-flow__node-default:contains(${node_name_1})`).each((index, $div, $list) => {
        cy.removeNodeDiv(index, $div, $list);
      });
      $body.find(`.react-flow__node-default:contains(${node_name_2})`).each((index, $div, $list) => {
        cy.removeNodeDiv(index, $div, $list);
      });
    });

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

    // nodes with the test name
    cy.get("body").then(($body) => {
      $body.find(`.react-flow__node-default:contains(${node_name_1})`).each((index, $div, $list) => {
        cy.removeNodeDiv(index, $div, $list);
      })
      $body.find(`.react-flow__node-default:contains(${node_name_2})`).each((index, $div, $list) => {
        cy.removeNodeDiv(index, $div, $list);
      })
    })

    cy.get(`.react-flow__node-default:contains(${node_name_1})`).should('not.exist');
    cy.get(`.react-flow__node-default:contains(${node_name_2})`).should('not.exist');

  })
})

describe('test add edge', () => {
  it('Can add and remove edges', () => {
    let node_name_1 = '__test__1'
    let node_name_2 = '__test__2'

    // remove pre-existing nodes with the test name
    cy.get("body").then(($body) => {
      $body.find(`.react-flow__node-default:contains(${node_name_1})`).each((index, $div, $list) => {
        cy.removeNodeDiv(index, $div, $list);
      });
      $body.find(`.react-flow__node-default:contains(${node_name_2})`).each((index, $div, $list) => {
        cy.removeNodeDiv(index, $div, $list);
      });
    });

    cy.get(`.react-flow__node-default:contains(${node_name_1})`).should('not.exist');
    cy.get(`.react-flow__node-default:contains(${node_name_2})`).should('not.exist');
    
    cy.insertNode(node_name_1);
    cy.insertNode(node_name_2);

    cy.get(`.react-flow__node-default:contains(${node_name_1})`).should('exist');
    cy.get(`.react-flow__node-default:contains(${node_name_2})`).should('exist');

    cy.get("body").then(($body) => {
      cy.wrap($body).get('.react-flow__edge-straight').should('have.length', 0);

      /*
      cy.wrap($body).get(`.react-flow__node-default:contains(${node_name_1})`).then(($node1) => {
        cy.wrap($body).get(`.react-flow__node-default:contains(${node_name_2})`).then(($node2) => {
          cy.wrap($node1).should('have.length', 1);
          cy.wrap($node2).should('have.length', 1);

          $node1.
          cy.wrap($node1).get('.react-flow__handle-bottom').then(($startHandle) => {
            cy.wrap($node2).get('.react-flow__handle-top').then(($endHandle) => {
              console.log(cy.wrap($node1));
              cy.wrap($startHandle).should('have.length', 1);
              cy.wrap($startHandle).trigger('mousedown');
              cy.wrap($endHandle).trigger('mouseup');
            });
          });
        });
      });
      */
      
      /*
      cy.wrap($body).get(`.react-flow__node-default:contains(${node_name_1})`).invoke('attr', 'data_id').then((data_id_1) => {
        cy.wrap($body).get(`.react-flow__node-default:contains(${node_name_2})`).invoke('attr', 'data_id').then((data_id_2) => {
          cy.get('').should('have.length', 1);

          cy.wrap($node1).should('have.length', 1);
          cy.wrap($node2).should('have.length', 1);

          $node1.
          cy.wrap($node1).get('.react-flow__handle-bottom').then(($startHandle) => {
            cy.wrap($node2).get('.react-flow__handle-top').then(($endHandle) => {
              console.log(cy.wrap($node1));
              cy.wrap($startHandle).should('have.length', 1);
              cy.wrap($startHandle).trigger('mousedown');
              cy.wrap($endHandle).trigger('mouseup');
            });
          });
        });
      });
      */

      cy.wrap($body).get(`.react-flow__node-default:contains(${node_name_2})`).find('.react-flow__handle-bottom').should('have.length', 1).trigger('mousedown');

      cy.wrap($body).get(`.react-flow__node-default:contains(${node_name_1})`).find('.react-flow__handle-top').should('have.length', 1).trigger('mouseup');




    });

    cy.get("body").then(($body) => {
      cy.wrap($body).get('.react-flow__edge-straight').should('have.length', 1);
    });

    // remove added nodes
    cy.get("body").then(($body) => {
      $body.find(`.react-flow__node-default:contains(${node_name_1})`).each((index, $div, $list) => {
        cy.removeNodeDiv(index, $div, $list);
      });
      $body.find(`.react-flow__node-default:contains(${node_name_2})`).each((index, $div, $list) => {
        cy.removeNodeDiv(index, $div, $list);
      });
    });

    cy.get(`.react-flow__node-default:contains(${node_name_1})`).should('not.exist');
    cy.get(`.react-flow__node-default:contains(${node_name_2})`).should('not.exist');

  })
})
