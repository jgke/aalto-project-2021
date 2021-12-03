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
