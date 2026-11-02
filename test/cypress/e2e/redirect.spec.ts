describe('/redirect', () => {
  describe('challenge "redirectChallenge"', () => {
    it('should show error page when supplying an unrecognized target URL', () => {
      cy.visit('/redirect?to=http://kimminich.de', {
        failOnStatusCode: false
      })
      cy.contains('Unrecognized target URL for redirect: http://kimminich.de')
    })
  })

  describe('challenge "redirectChallenge"', () => {
    it('should reject an allowlisted URL embedded in an external target', () => {
      cy.request({
        url: '/redirect?to=https://owasp.org?trickIndexOf=https://github.com/juice-shop/juice-shop',
        followRedirect: false,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(406)
        expect(response.headers.location).to.be.undefined
      })

    })
  })

  describe('challenge "redirectCryptoCurrencyChallenge"', () => {
    it('should still redirect to forgotten entry https://etherscan.io/address/0x0f933ab9fcaaa782d0279c300d73750e1311eae6 on allowlist', () => {
      cy.visit(
        '/redirect?to=https://etherscan.io/address/0x0f933ab9fcaaa782d0279c300d73750e1311eae6',
        {
          failOnStatusCode: false
        }
      )
      cy.expectChallengeSolved({ challenge: 'Outdated Allowlist' })
    })
  })
})
