import { ProductsAPI } from '../../../support/page-objects/api/products-api'
import { ValidationHelpers } from '../../../support/helpers/validation-helpers'
import { TestDataManager } from '../../../support/managers/test-data-manager'

describe('DummyJSON Tests for GET products', () => {
  const productsAPI = new ProductsAPI()
  const testData = TestDataManager.createDummyJsonTestSuite()

  context('Basic Product Retrieval', () => {
    it('should get all products with default pagination', () => {
      productsAPI.getAllProductsWithValidation()
        .then((response) => {
          expect(response.body.total).to.be.above(0)
          expect(response.body.products).to.be.an('array')
          
          if (response.body.products.length > 0) {
            ValidationHelpers.validateProductStructure(response.body.products[0])
          }
        })
    })

    it('should get a specific product by ID', () => {
      const validProductId = TestDataManager.getValidProductId()
      
      productsAPI.getProductByIdWithValidation(validProductId)
        .then((response) => {
          expect(response.body.id).to.equal(validProductId)
          expect(response.body.title).to.be.a('string').and.not.empty
          ValidationHelpers.validateProductStructure(response.body)
        })
    })
  })

  context('Pagination Tests', () => {
    testData.paginationTests.forEach((paginationParams, index) => {
      it(`should handle pagination - Case ${index + 1}: limit=${paginationParams.limit}, skip=${paginationParams.skip}`, () => {
        productsAPI.getAllProductsWithValidation(paginationParams)
          .then((response) => {
            expect(response.body.limit).to.equal(paginationParams.limit)
            expect(response.body.skip).to.equal(paginationParams.skip)
            expect(response.body.products).to.have.length.at.most(paginationParams.limit)
            
            // Validate first product ID if products exist
            if (response.body.products.length > 0 && paginationParams.skip > 0) {
              const expectedFirstId = paginationParams.skip + 1
              expect(response.body.products[0].id).to.equal(expectedFirstId)
            }
          })
      })
    })

    testData.edgeCasePagination.forEach((edgeParams, index) => {
      it(`should handle edge case pagination - Case ${index + 1}: limit=${edgeParams.limit}, skip=${edgeParams.skip}`, () => {
        productsAPI.getAllProducts(edgeParams)
          .then((response) => {
            // Edge cases might return different status codes or empty results
            expect(response.status).to.be.oneOf([200, 400])
            
            if (response.status === 200) {
              ValidationHelpers.validatePaginationStructure(response.body)
            }
          })
      })
    })
  })

  context('Select Fields Tests', () => {
  it('should handle single field selection', () => {
    productsAPI.getAllProductsWithValidation({ 
      limit: 3, 
      skip: 0, 
      select: 'title' 
    })
      .then((response) => {
        response.body.products.forEach((product: any) => {
          expect(product).to.have.property('title')
          expect(product).to.have.property('id')
          expect(product.id).to.be.a('number').and.above(0)
          expect(product.title).to.be.a('string').and.not.be.empty
        })
      })
  })

  it('should handle multiple fields selection', () => {
    const selectFields = ['title', 'price']
    const selectString = selectFields.join(',')
    
    productsAPI.getAllProductsWithValidation({ 
      limit: 5, 
      skip: 0, 
      select: selectString 
    })
      .then((response) => {
        expect(response.body.products).to.have.length.above(0, 'Should return some products for validation')
        
        response.body.products.forEach((product: any, index: number) => {
          const expectedFields = ['id', ...selectFields]
          
          expect(Object.keys(product)).to.have.length(expectedFields.length,
            `Product ${index} should have exactly ${expectedFields.length} fields: ${expectedFields.join(', ')}`)
          
          expect(product, `Product ${index} should always have 'id' field`)
            .to.have.property('id')
          expect(product.id, `Product ${index} ID should be a positive number`)
            .to.be.a('number').and.above(0)
          
          selectFields.forEach(field => {
            expect(product, `Product ${index} should have selected field '${field}'`)
              .to.have.property(field)
            expect(product[field], `Field '${field}' should not be undefined`)
              .to.not.be.undefined
          })
          
          Object.keys(product).forEach(key => {
            expect(expectedFields, `Product ${index} should not have unexpected field '${key}'`)
              .to.include(key)
          })
        })
      })
  })

  context('Search Tests', () => {
    testData.validSearchTerms.forEach((searchTerm) => {
      it(`should search products by query: "${searchTerm}"`, () => {
        productsAPI.searchProducts(searchTerm)
          .then((response) => {
            ValidationHelpers.validateStatusCode(response.status, 200)
            ValidationHelpers.validatePaginationStructure(response.body)
            
            // Validate search results contain the search term
            if (response.body.products.length > 0) {
              response.body.products.forEach((product: any) => {
                const titleMatch = product.title.toLowerCase().includes(searchTerm.toLowerCase())
                const descMatch = product.description.toLowerCase().includes(searchTerm.toLowerCase())
                expect(titleMatch || descMatch, 
                  `Product "${product.title}" should contain "${searchTerm}" in title or description`
                ).to.be.true
              })
            }
          })
      })
    })

    testData.invalidSearchTerms.forEach((invalidTerm) => {
      it(`should handle invalid search term: "${invalidTerm}"`, () => {  //This test failed, returns all the products instead of expected empty result
        productsAPI.getEmptySearchResults(invalidTerm)
          .then((response) => {
            expect(response.status).to.equal(200)
            expect(response.body.products.length).to.equal(0)
          })
      })
    })
  })

  context('Error Handling Tests', () => {
    testData.invalidProductIds.forEach((invalidId) => {
      it(`should handle non-existent product ID: ${invalidId}`, () => {
        productsAPI.getProductByInvalidIdWithValidation(invalidId)
      })
    })

    it('should handle non-existent product ID gracefully', () => {
      const invalidId = TestDataManager.getInvalidProductId()
      
      productsAPI.getNonExistentProduct(invalidId)
        .then((response) => {
          ValidationHelpers.validateStatusCode(response.status, 404)
          expect(response.body).to.have.property('message')
        })
    })
  })

  context('Product Validation Tests', () => {
    it('should validate product pricing information', () => {
      const validProductId = TestDataManager.getValidProductId()
      
      productsAPI.getProductByIdWithValidation(validProductId)
        .then((response) => {
          const product = response.body
          
          // Price validations
          expect(product.price).to.be.a('number').and.above(0)
          expect(product.discountPercentage).to.be.a('number').and.at.least(0)
          expect(product.rating).to.be.a('number').and.at.least(0).and.at.most(5)
          expect(product.stock).to.be.a('number').and.at.least(0)
        })
    })

    it('should validate product structure for multiple products', () => {
      productsAPI.getAllProductsWithValidation({ limit: 10, skip: 0 })
        .then((response) => {
          expect(response.body.products).to.have.length.above(0)
          
          response.body.products.forEach((product: any, index: number) => {
            ValidationHelpers.validateProductStructure(product)
            cy.log(`Validated product ${index + 1}: ${product.title}`)
          })
        })
    })
  })

  context('Random Data Tests', () => {
    it('should test with random valid product ID', () => {
      const randomValidId = TestDataManager.getValidProductId()
      
      productsAPI.getProductByIdWithValidation(randomValidId)
        .then((response) => {
          expect(response.body.id).to.equal(randomValidId)
          ValidationHelpers.validateProductStructure(response.body)
        })
    })

    it('should test with random pagination parameters', () => {
      const randomPagination = TestDataManager.getRandomPaginationParams()
      
      productsAPI.getAllProductsWithValidation(randomPagination)
        .then((response) => {
          expect(response.body.limit).to.equal(randomPagination.limit)
          expect(response.body.skip).to.equal(randomPagination.skip)
        })
    })

    it('should test with random search term', () => {
      const randomSearchTerm = TestDataManager.getValidSearchTerm()
      
      productsAPI.searchProducts(randomSearchTerm)
        .then((response) => {
          ValidationHelpers.validateStatusCode(response.status, 200)
          ValidationHelpers.validatePaginationStructure(response.body)
          
          if (response.body.products.length > 0) {
            response.body.products.forEach((product: any) => {
              const titleMatch = product.title.toLowerCase().includes(randomSearchTerm.toLowerCase())
              const descMatch = product.description.toLowerCase().includes(randomSearchTerm.toLowerCase())
              expect(titleMatch || descMatch).to.be.true
            })
          }
        })
    })
  })

})
})
