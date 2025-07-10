import { ProductsAPI } from '../../../support/page-objects/api/products-api'


describe('Products DELETE API Tests', () => {
  const productsAPI = new ProductsAPI()

  context('Valid Product DELETE', () => {
    it('should delete product with random valid data', () => {
      productsAPI.deleteProductWithValidation()
        .then((response) => {
          expect(response.body.id).to.be.a('number').and.above(0)
          expect(response.body.title).to.be.a('string').and.not.be.empty
          expect(response.body.price).to.be.a('number').and.above(0)
        })
    })
  })

  context('Invalid Product DELETE', () => { 
    it('should return message for non-existent product id', () => {
        productsAPI.deleteProductWithRandomInvalidId()
          .then((response) => {
            expect(response.body.message).to.be.a('string').and.not.be.empty
          })
    }) 
  })
}) 