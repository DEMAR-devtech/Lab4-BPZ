describe('/#/deluxe-membership', () => {
  describe('challenge "svgInjectionChallenge"', () => {
    it('should reject an external image loaded through an allowlist bypass', () => {
      cy.login({ email: 'jim', password: 'ncc-1701' })
      cy.location().then((loc) => {
        cy.visit(
          `/#/deluxe-membership?testDecal=${encodeURIComponent(
            `../../..${loc.pathname.replace(/\/$/, '')}/redirect?to=https://cataas.com/cat?x=https://github.com/juice-shop/juice-shop`
          )}`
        )
      })

      cy.get('svg image').eq(1).invoke('attr', 'href').then((href) => {
        expect(href).to.include('/redirect?to=')
        cy.request({ url: new URL(href!, Cypress.config('baseUrl')!).href, followRedirect: false, failOnStatusCode: false }).then((response) => {
          expect(response.status).to.eq(406)
          expect(response.headers.location).to.be.undefined
        })
      })
    })
  })

  describe('challenge "freeDeluxeChallenge"', () => {
    it('should upgrade to deluxe for free by making a post request to /rest/deluxe-membership by setting the paymentMode parameter to null', () => {
      cy.login({
        email: 'jim',
        password: 'ncc-1701'
      })
      cy.visit('/#/')
      cy.getCookie('token').then((token) => {
        cy.request({
          url: '/rest/deluxe-membership',
          method: 'POST',
          headers: { Authorization: `Bearer ${token?.value}` }
        }).then((response) => {
          expect(response.body.status).contains('success')
        })
      })
      cy.expectChallengeSolved({ challenge: 'Deluxe Fraud' })
    })
  })
})
