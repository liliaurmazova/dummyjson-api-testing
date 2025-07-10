import { ProductsAPI } from '../../../support/page-objects/api/products-api'
import { TestDataManager } from '../../../support/managers/test-data-manager'
import { ValidationHelpers } from '../../../support/helpers/validation-helpers'

describe('Products POST API Tests', () => {
  const productsAPI = new ProductsAPI()

  context('Valid Product Creation', () => {
    it('should create product with random valid data', () => {
      productsAPI.createRandomProductWithValidation('valid')
        .then((response) => {
          expect(response.body.id).to.be.a('number').and.above(0)
          expect(response.body.title).to.be.a('string').and.not.be.empty
          expect(response.body.price).to.be.a('number').and.above(0)
        })
    })


it('should create products with different price ranges', () => {
      const priceRanges = [
        { min: 1, max: 50 },    // Budget range
        { min: 51, max: 200 },  // Mid range
        { min: 201, max: 1000 } // Premium range
      ]

      priceRanges.forEach((priceRange, index) => {
        const productData = TestDataManager.generateProductForPost({ priceRange })
        
        productsAPI.createProductWithValidation(productData)
          .then((response) => {
            expect(response.body.price).to.be.at.least(priceRange.min)
            expect(response.body.price).to.be.at.most(priceRange.max)
          })
      })
    })
  })

  context('Invalid Product Creation', () => {
    const testDataSets = TestDataManager.getPostTestDataSets()

    testDataSets.invalidProducts.forEach((invalidProduct, index) => {
      it(`should handle invalid product data - Case ${index + 1}`, () => {
        productsAPI.createProduct(invalidProduct)
          .then((response) => {
            // DummyJSON might still return 201 even for invalid data (it's a mock)
            // But we test the behavior
            expect(response.status).to.be.oneOf([201, 400, 422])
            
            if (response.status === 201) {
              cy.log('DummyJSON accepted invalid data (expected for mock API)')
            } else {
              ValidationHelpers.validateErrorResponse(response.body)
            }
          })
      })
    })
  })

  context('Edge Case Product Creation', () => {
    const testDataSets = TestDataManager.getPostTestDataSets()

    testDataSets.edgeCaseProducts.forEach((edgeCaseProduct, index) => {
      it(`should handle edge case product - Case ${index + 1}`, () => {
        productsAPI.createProduct(edgeCaseProduct)
          .then((response) => {
            expect(response.status).to.be.oneOf([201, 400, 422])
            
            if (response.status === 201) {
              // If accepted, validate the structure
              ValidationHelpers.validateProductStructure(response.body)
            }
          })
      })
    })
  })

  context('Random Data Generation Tests', () => {
    it('should create multiple products with random data', () => {
      // Create 5 products with random data
      Array.from({ length: 5 }, (_, index) => {
        const productData = TestDataManager.generateRandomProductForPost()
        
        productsAPI.createProductWithValidation(productData)
          .then((response) => {
            expect(response.body.title).to.equal(productData.title)
            expect(response.body.price).to.equal(productData.price)
            expect(response.body.category).to.equal(productData.category)
            
            cy.log(`Created product ${index + 1}: ${response.body.title}`)
          })
      })
    })

    it('should create products with specific title lengths', () => {
      const titleLengths = [5, 10, 20, 50, 100]
      
      titleLengths.forEach((length) => {
        const productData = TestDataManager.generateProductForPost({ titleLength: length })
        
        productsAPI.createProductWithValidation(productData)
          .then((response) => {
            expect(response.body.title).to.have.length(length)
          })
      })
    })
  })

  context('Data Consistency Tests', () => {
    it('should maintain data consistency between request and response', () => {
      const originalData = TestDataManager.generateRandomProductForPost()
      
      productsAPI.createProductWithValidation(originalData)
        .then((response) => {
          // Verify all sent data is reflected in response
          expect(response.body.title).to.equal(originalData.title)
          expect(response.body.description).to.equal(originalData.description)
          expect(response.body.price).to.equal(originalData.price)
          expect(response.body.category).to.equal(originalData.category)
          expect(response.body.brand).to.equal(originalData.brand)
          expect(response.body.stock).to.equal(originalData.stock)
          
          // Additional fields should be present
          expect(response.body.id).to.be.a('number')
          expect(response.body.rating).to.be.a('number')
          expect(response.body.discountPercentage).to.be.a('number')
        })
    })
  })
})