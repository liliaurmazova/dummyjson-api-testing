import { ProductsAPI } from '../../../support/page-objects/api/products-api'
import { TestDataManager } from '../../../support/managers/test-data-manager'

describe('DummyJSON Tests for GET Categories', () => {
  const productsAPI = new ProductsAPI()

    context('Category Tests', () => {
    it('should get products by valid category', () => {
      const validCategory = TestDataManager.getValidCategory()
      
      productsAPI.getProductsByCategoryWithValidation(validCategory)
        .then((response) => {
          if (response.body.products.length > 0) {
            response.body.products.forEach((product: any) => {
              expect(product.category).to.equal(validCategory)
            })
          }
        })
    })

    it('should handle invalid category', () => {   
      const invalidCategory = TestDataManager.getInvalidCategory()
      
      productsAPI.getNonExistentCategoryWithValidation(invalidCategory)
        .then((response) => {
          expect(response.body.total).to.equal(0)
        })
    })

    it('should get categories with proper structure', () => {
      productsAPI.getCategoriesWithValidation()
        .then((response) => {
          expect(response.body).to.be.an('array').and.not.be.empty
          
          response.body.forEach((category: any) => {
            expect(category).to.have.all.keys('slug', 'name', 'url')
            expect(category.slug).to.be.a('string').and.not.be.empty
            expect(category.name).to.be.a('string').and.not.be.empty
            expect(category.url).to.include('dummyjson.com/products/category/')
          })
        })
    })

    it('should get category list as strings', () => {
      productsAPI.getCategoryListWithValidation()
        .then((response) => {
          expect(response.body).to.be.an('array').and.not.be.empty
          
          response.body.forEach((category: any) => {
            expect(category).to.be.a('string').and.not.be.empty
            expect(category).to.match(/^[a-z][a-z0-9-]*[a-z0-9]$/)
          })
        })
    })
    })
})
