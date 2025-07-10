/**
 * Validation helper functions for API responses
 */
export class ValidationHelpers {
  
  /**
   * Validate HTTP status code
   */
  static validateStatusCode(actual: number, expected: number): void {
    expect(actual).to.equal(expected, `Expected status ${expected} but got ${actual}`)
  }

  /**
   * Validate response has required properties
   */
  static validateResponseStructure(response: any, requiredProps: string[]): void {
    expect(response).to.be.an('object')
    requiredProps.forEach(prop => {
      expect(response).to.have.property(prop)
    })
  }

  /**
   * Validate array response
   */
  static validateArrayResponse(response: any, minLength: number = 0): void {
    expect(response).to.be.an('array')
    expect(response.length).to.be.at.least(minLength)
  }

  /**
   * Validate DummyJSON pagination structure (uses 'products' not 'data')
   */
  static validatePaginationStructure(response: any, allowEmpty: boolean = false): void {
    const requiredPaginationProps = ['total', 'skip', 'limit', 'products']
    this.validateResponseStructure(response, requiredPaginationProps)

    if (allowEmpty) {
      expect(response.total).to.be.a('number').and.at.least(0)
    }
    else {
      expect(response.total).to.be.a('number').and.above(0)
    }

    expect(response.skip).to.be.a('number').and.at.least(0)
    expect(response.limit).to.be.a('number').and.above(0)
    expect(response.products).to.be.an('array')
  }

  /**
   * Validate user object structure
   */
  static validateUserStructure(user: any): void {
    const requiredUserProps = ['id', 'username', 'email', 'firstName', 'lastName']
    this.validateResponseStructure(user, requiredUserProps)
    expect(user.id).to.be.a('number')
    expect(user.username).to.be.a('string').and.not.empty
    expect(user.email).to.be.a('string').and.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    expect(user.firstName).to.be.a('string').and.not.empty
    expect(user.lastName).to.be.a('string').and.not.empty
  }

  /**
   * Validate product object structure
   */
  static validateProductStructure(product: any): void {
    const requiredProductProps = ['id', 'title', 'description', 'price', 'stock', 'category']
    this.validateResponseStructure(product, requiredProductProps)
    expect(product.id).to.be.a('number')
    expect(product.title).to.be.a('string').and.not.empty
    expect(product.description).to.be.a('string')
    expect(product.price).to.be.a('number').and.above(0)
    expect(product.stock).to.be.a('number').and.at.least(0)
    expect(product.category).to.be.a('string').and.not.empty
  }

  /**
   * Validate error response structure
   */
  static validateErrorResponse(response: any, expectedMessage?: string): void {
    expect(response).to.have.property('message')
    expect(response.message).to.be.a('string')
    
    if (expectedMessage) {
      expect(response.message).to.include(expectedMessage)
    }
  }

  /**
   * Validate date format (ISO 8601)
   */
  static validateDateFormat(dateString: string): void {
    expect(dateString).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    expect(new Date(dateString).toString()).to.not.equal('Invalid Date')
  }

  /**
   * Validate numeric range
   */
  static validateNumericRange(value: number, min: number, max: number): void {
    expect(value).to.be.a('number')
    expect(value).to.be.at.least(min)
    expect(value).to.be.at.most(max)
  }

  //validation message helper
  static validateNotFoundMessage(responseBody: any, id: number | string, entityType: string = 'Product') {
  expect(responseBody).to.have.property('message')
  
  const possibleMessages = [
    `${entityType} with id ${id} not found`,
    `${entityType} with id '${id}' not found`,  
    `${entityType} with id "${id}" not found`,
    `${entityType} with ${id} not found`
  ]
  
  const actualMessage = responseBody.message
  const messageMatches = possibleMessages.some(msg => actualMessage.includes(msg))
  
  expect(messageMatches, 
    `Expected message to match one of: ${possibleMessages.join(' OR ')}. Got: ${actualMessage}`
  ).to.be.true
}
}