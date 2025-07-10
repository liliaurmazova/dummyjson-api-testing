/// <reference types="cypress" />

import { ApiRequestOptions } from '../types/test-types'

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Make an API request to DummyJSON
       */
      apiRequest(options: ApiRequestOptions): Chainable<Cypress.Response<any>>
      
      /**
       * Validate API response structure
       */
      validateApiResponse(expectedStatus: number, schema?: any): Chainable<Cypress.Response<any>>
    }
  }
}

Cypress.Commands.add('apiRequest', (options: ApiRequestOptions) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }

  const apiUrl = Cypress.env('apiUrl') || 'https://dummyjson.com'

  return cy.request({
    method: options.method,
    url: `${apiUrl}${options.url}`,
    body: options.body,
    headers: {
      ...defaultHeaders,
      ...options.headers
    },
    failOnStatusCode: options.failOnStatusCode ?? false,
    timeout: 30000
  })
})

Cypress.Commands.add('validateApiResponse', { prevSubject: true }, (response: Cypress.Response<any>, expectedStatus: number, schema?: any) => {
  expect(response.status).to.eq(expectedStatus)
  expect(response.body).to.exist
  
  if (schema) {
    cy.log('Schema validation would be implemented here')
  }
  
  return cy.wrap(response)
})