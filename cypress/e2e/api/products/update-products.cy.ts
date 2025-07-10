import { ProductsAPI } from '../../../support/page-objects/api/products-api'
import { TestDataManager } from '../../../support/managers/test-data-manager'
import { ValidationHelpers } from '../../../support/helpers/validation-helpers'

describe('Products UPDATE API Tests', () => {
  const productsAPI = new ProductsAPI()

  context('Valid Product Updates (PUT)', () => {
    it('should update product with random valid data from test sets', () => {
      const productId = TestDataManager.getValidProductId()
      const updateData = TestDataManager.generateRandomProductForPost()
      
      productsAPI.updateProductWithValidation(productId, updateData, true)
        .then((response) => {
          expect(response.body.id).to.equal(productId)
          expect(response.body.title).to.equal(updateData.title)
          expect(response.body.price).to.equal(updateData.price)
          expect(response.body.category).to.equal(updateData.category)
        })
    })

    it('should update products with all valid data sets', () => {
      const testDataSets = TestDataManager.getPostTestDataSets()
      
      testDataSets.validProducts.forEach((validProduct, index) => {
        const productId = index + 1 // Use sequential IDs
        
        productsAPI.updateProductWithValidation(productId, validProduct, true)
          .then((response) => {
            expect(response.body.title).to.equal(validProduct.title)
            expect(response.body.price).to.equal(validProduct.price)
            expect(response.body.category).to.equal(validProduct.category)
            cy.log(`Updated product ${productId} with valid data set ${index + 1}`)
          })
      })
    })
  })

  context('Invalid Product Updates (PUT)', () => {
    it('should handle random invalid data from test sets', () => {
      const productId = TestDataManager.getValidProductId()
      const invalidData = TestDataManager.generateInvalidProductData()
      
      productsAPI.updateProductWithValidation(productId, invalidData, false)
        .then((response) => {
          // DummyJSON might still return 200 for invalid data
          expect(response.status).to.be.oneOf([200, 400, 422])
          cy.log('Tested random invalid update data')
        })
    })

    it('should handle all invalid data sets', () => {
      const testDataSets = TestDataManager.getPostTestDataSets()
      
      testDataSets.invalidProducts.forEach((invalidProduct, index) => {
        const productId = TestDataManager.getValidProductId()
        
        productsAPI.updateProductWithValidation(productId, invalidProduct, false)
          .then((response) => {
            expect(response.status).to.be.oneOf([200, 400, 422])
            cy.log(`Tested invalid update data set ${index + 1}`)
          })
      })
    })
  })

  context('Valid Product Patches (PATCH)', () => {
    it('should patch product with random valid data', () => {
      const productId = TestDataManager.getValidProductId()
      const patchData = { 
        title: 'Updated Title', 
        price: 199.99 
      }
      
      productsAPI.patchProductWithValidation(productId, patchData, true)
        .then((response) => {
          expect(response.body.id).to.equal(productId)
          expect(response.body.title).to.equal(patchData.title)
          expect(response.body.price).to.equal(patchData.price)
        })
    })

    it('should patch with specific fields from valid data sets', () => {
      const testDataSets = TestDataManager.getPostTestDataSets()
      const validProduct = testDataSets.validProducts[0]
      
      // Test patching individual fields
      const patchTests = [
        { title: validProduct.title },
        { price: validProduct.price },
        { description: validProduct.description },
        { title: validProduct.title, price: validProduct.price } // Multiple fields
      ]

      patchTests.forEach((patchData, index) => {
        const productId = TestDataManager.getValidProductId()
        
        productsAPI.patchProductWithValidation(productId, patchData, true)
          .then((response) => {
            Object.keys(patchData).forEach(key => {
              expect(response.body[key]).to.equal(patchData[key as keyof typeof patchData])
            })
            cy.log(`Patch test ${index + 1} completed`)
          })
      })
    })
  })

  context('Invalid Product Patches (PATCH)', () => {
    it('should handle random invalid patch data', () => {
      const productId = TestDataManager.getValidProductId()
      const invalidPatchData = { price: -1 } // Invalid price
      
      productsAPI.patchProductWithValidation(productId, invalidPatchData, false)
        .then((response) => {
          expect(response.status).to.be.oneOf([200, 400, 422])
          cy.log('Tested random invalid patch data')
        })
    })

    it('should handle invalid fields from invalid data sets', () => {
      const testDataSets = TestDataManager.getPostTestDataSets()
      
      testDataSets.invalidProducts.forEach((invalidProduct, index) => {
        const productId = TestDataManager.getValidProductId()
        
        // Extract one invalid field for PATCH testing
        const invalidFields = Object.keys(invalidProduct)
        const fieldToTest = invalidFields[0]
        const patchData = { [fieldToTest]: invalidProduct[fieldToTest] }
        
        productsAPI.patchProductWithValidation(productId, patchData, false)
          .then((response) => {
            expect(response.status).to.be.oneOf([200, 400, 422])
            cy.log(`Tested invalid patch field '${fieldToTest}' from set ${index + 1}`)
          })
      })
    })
  })
})