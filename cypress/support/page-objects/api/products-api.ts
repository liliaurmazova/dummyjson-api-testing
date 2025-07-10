import { ApiConstants } from "@/support/constants/api-constants";
import { HttpMethod } from "@/support/constants/http-method";
import { ValidationHelpers } from "@/support/helpers/validation-helpers";
import { Product } from "../../types/api-types";
import { TestDataManager } from "@/support/managers/test-data-manager";

export class ProductsAPI {
  private productsUrl = ApiConstants.PRODUCTS;
  private categoriesUrl = ApiConstants.CATEGORIES;
  private singleCategoryUrl = ApiConstants.SINGLE_CATEGORY;
  private categoryListUrl = ApiConstants.CATEGORY_LIST;
  private searchUrl = ApiConstants.SEARCH;
  private addProductUrl = ApiConstants.ADD_PRODUCT;
  
   /*   * Product API methods 
   
   Get products and categories
   */
  getAllProducts(params?: { limit?: number; skip?: number, select?: string }) {
    let queryString = ''
    
    if (params) {
      const stringParams: Record<string, string> = {}
      
      if (params.limit !== undefined) {
        stringParams.limit = params.limit.toString()
      }
      
      if (params.skip !== undefined) {
        stringParams.skip = params.skip.toString()
      }

      if (params.select !== undefined) {
        stringParams.select = params.select.toString()
      }
      
      queryString = `?${new URLSearchParams(stringParams).toString()}`
    }
    
    return cy.apiRequest({
      method: HttpMethod.GET,
      url: `${this.productsUrl}${queryString}`
    })
  }
  
  getProductById(id: number) {
    return cy.apiRequest({
      method: HttpMethod.GET,
      url: `${this.productsUrl}/${id}`
    })
  }
  
  searchProducts(query: string) {
    return cy.apiRequest({
      method: HttpMethod.GET,
      url: `${this.searchUrl}${encodeURIComponent(query)}`
    })
  }

  getProductsByCategory(category: string) {
    return cy.apiRequest({
      method: HttpMethod.GET,
      url: `${this.singleCategoryUrl}/${category}`
    })
  }
  
  getCategoryList() {
    return cy.apiRequest({
      method: HttpMethod.GET,
      url: `${this.categoryListUrl}`
    })
  }

  getCategories() {
    return cy.apiRequest({
      method: HttpMethod.GET,
      url: `${this.categoriesUrl}`
    })
  }

  
 /*   
   
   Create random products
   */ 
createProduct(productData : any) {
    return cy.apiRequest({
      method: HttpMethod.POST,
      url: `${this.addProductUrl}`,
      body: productData,
            headers: {
        'Content-Type': 'application/json'
      }
    })
  }

createRandomProduct() {
  const productData = TestDataManager.generateRandomProductForPost()
  return this.createProduct(productData)
}
  
   /**
 * Create product with specific test scenario
 */
createProductWithScenario(scenario: 'valid' | 'invalid' | 'edge-case', options?: any) {
  let productData: any

  switch (scenario) {
    case 'valid':
      productData = TestDataManager.generateProductForPost({ withValidData: true, ...options })
      break
    case 'invalid':
      productData = TestDataManager.generateInvalidProductData()
      break
    case 'edge-case':
      const edgeCases = TestDataManager.getPostTestDataSets().edgeCaseProducts
      productData = edgeCases[Math.floor(Math.random() * edgeCases.length)]
      break
    default:
      productData = TestDataManager.generateRandomProductForPost()
  }

  return cy.apiRequest({
    method: HttpMethod.POST,
    url: ApiConstants.ADD_PRODUCT,
    body: productData,
    failOnStatusCode: false
  })
}

createRandomProductWithValidation(scenario: 'valid' | 'invalid' | 'edge-case' = 'valid') {
  return this.createProductWithScenario(scenario).then((response) => {
    if (scenario === 'valid') {
      ValidationHelpers.validateStatusCode(response.status, 201)
      ValidationHelpers.validateProductStructure(response.body)
    } else {
      expect(response.status).to.be.oneOf([201, 400, 422, 500])
    }
    return response
  })
}

  updateProduct(id: number, product: Partial<Product>) {
    return cy.apiRequest({
      method: HttpMethod.PUT,
      url: `${this.productsUrl}/${id}`,
      body: product,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  patchProduct(id: number, product: Partial<Product>) {
    return cy.apiRequest({
      method: HttpMethod.PATCH,
      url: `${this.productsUrl}/${id}`,
      body: product
    })
  }

  deleteProduct(id: number) {
    return cy.apiRequest({
      method: HttpMethod.DELETE,
      url: `${this.productsUrl}/${id}`
    })
  }

  //Non-existent IDs methods
  updateNonExistentProduct(id: number, productData: Partial<Product>) {
    return cy.apiRequest({
      method: HttpMethod.PUT,
      url: `${this.productsUrl}/${id}`,
      body: productData,
      failOnStatusCode: false
    })
  }

  patchNonExistentProduct(id: number, productData: Partial<Product>) {
    return cy.apiRequest({
      method: HttpMethod.PATCH,
      url: `${this.productsUrl}/${id}`,
      body: productData,
      failOnStatusCode: false
    })
  }
  
  deleteNonExistentProduct(id: number) {
    return cy.apiRequest({
      method: HttpMethod.DELETE,
      url: `${this.productsUrl}/${id}`,
      failOnStatusCode: false
    })
  }
  
  /*   * Validation methods
  
  
  Positive tests
  ****************************************************************************************************************/
  //checks that it is possible to get products with limit, skip and select
  getAllProductsWithValidation(params?: { limit?: number; skip?: number; select?: string }) {
  
    return this.getAllProducts(params).then((response) => {
    ValidationHelpers.validateStatusCode(response.status, 200)
    ValidationHelpers.validatePaginationStructure(response.body)
    
    // Limit check
    if (params?.limit !== undefined) {
      const expectedCount = Math.min(params.limit, response.body.total - (params.skip || 0))
      expect(response.body.products).to.have.length(
        Math.max(0, expectedCount),
        `Product count should equal limit (${params.limit}) or remaining items`
      )
      
      expect(response.body.limit).to.equal(params.limit, 'Response limit should match requested limit')
    }
    
    // Skip
    if (response.body.products.length > 0 && params?.skip !== undefined) {
      const firstProductId = response.body.products[0].id
      const expectedFirstId = (params.skip || 0) + 1
      expect(firstProductId).to.equal(
        expectedFirstId,
        `First product ID should be ${expectedFirstId} (skip: ${params.skip} + 1)`
      )
      
      expect(response.body.skip).to.equal(params.skip, 'Response skip should match requested skip')
    }
    
    // Select
    if (params?.select !== undefined && response.body.products.length > 0) {
      
      const selectedFields = params.select.split(',').map(field => field.trim())

      const expectedFields = selectedFields.includes('id') 
      ? selectedFields 
      : ['id', ...selectedFields]
  
   response.body.products.forEach((product: any, index: number) => {
    const productKeys = Object.keys(product)
    
    // Validate exact number of properties
    expect(productKeys).to.have.length(expectedFields.length, 
      `Product ${index} should have exactly ${expectedFields.length} properties (${expectedFields.join(', ')}), but got ${productKeys.length} (${productKeys.join(', ')})`
    )
    
    expectedFields.forEach(field => {
      expect(product, `Product ${index} is missing required field '${field}'. Available fields: ${productKeys.join(', ')}`)
        .to.have.property(field)
      
      // Also validate the field has a value (not undefined)
      expect(product[field], `Field '${field}' in product ${index} should not be undefined`)
        .to.not.be.undefined
    })

    productKeys.forEach(key => {
      expect(expectedFields, `Product ${index} has unexpected field '${key}'. Expected only: ${expectedFields.join(', ')}`)
        .to.include(key)
    })
  })
}      
    
   // Log validation summary
    const summary = {
      totalProducts: response.body.total,
      returnedCount: response.body.products.length,
      limit: response.body.limit,
      skip: response.body.skip,
      selectedFields: params?.select ? params.select.split(',').map(f => f.trim()) : 'all fields'
    }
    
    return response
  })
}
  
  getProductByIdWithValidation(id: number) {

    return this.getProductById(id).then((response) => {
      ValidationHelpers.validateStatusCode(response.status, 200)
      ValidationHelpers.validateProductStructure(response.body)
      return response
    })
  }
  
  getProductsByCategoryWithValidation(category: string) {

    return this.getProductsByCategory(category).then((response) => {
    ValidationHelpers.validateStatusCode(response.status, 200)
    ValidationHelpers.validatePaginationStructure(response.body)
    
    // All products belong to the requested category
    if (response.body.products && response.body.products.length > 0) {
      response.body.products.forEach((product: any, index: number) => {
        expect(product.category, `Product at index ${index} should have category '${category}'`)
          .to.equal(category)
      })

    }
    return response
  })
}
  getCategoriesWithValidation() {

    return this.getCategories().then((response) => {
    ValidationHelpers.validateStatusCode(response.status, 200)
    
    expect(response.body).to.be.an('array').and.not.be.empty

    response.body.forEach((category: any, index: number) => {
      expect(category, `Category at index ${index} should be an object`).to.be.an('object')
      
      expect(category, `Category at index ${index} should have 'slug' property`)
        .to.have.property('slug').that.is.a('string').and.not.be.empty
      
        expect(category, `Category at index ${index} should have 'name' property`)
        .to.have.property('name').that.is.a('string').and.not.be.empty
      
      expect(category, `Category at index ${index} should have 'url' property`)
        .to.have.property('url').that.is.a('string').and.not.be.empty
      
      expect(category.url, `Category URL should be valid`)
        .to.match(/^https:\/\/dummyjson\.com\/products\/category\/[\w-]+$/)
      
      expect(category.url, `URL should contain the category slug '${category.slug}'`)
        .to.include(category.slug)
    })
    
    return response
  })
}


getCategoryListWithValidation() {

  return this.getCategoryList().then((response) => {
    ValidationHelpers.validateStatusCode(response.status, 200)
    
    expect(response.body).to.be.an('array').and.not.be.empty
    
    response.body.forEach((category: any, index: number) => {
      expect(category, `Category at index ${index} should be a string`)
        .to.be.a('string').and.not.be.empty
      
      expect(category, `The URL of category '${category}' should follow naming convention`)
        .to.match(/^[a-z][a-z0-9-]*[a-z0-9]$/)
    })
    
    return response
  })
}
  
  getEmptySearchResults(query: string = '') {

    return cy.apiRequest({
      method: HttpMethod.GET,
      url: `${this.searchUrl}${encodeURIComponent(query)}`,
      failOnStatusCode: false
      }).then((response) => {
    
    ValidationHelpers.validateStatusCode(response.status, 200)

    expect(response.body.products).to.be.an('array')
    expect(response.body.total).to.equal(0, 'Invalid search should return 0 total')
    expect(response.body.products).to.be.empty
    
    return response
  })

  }

  createProductWithValidation(product: Partial<Product>) {

    return this.createProduct(product).then((response) => {
      ValidationHelpers.validateStatusCode(response.status, 201)
      ValidationHelpers.validateProductStructure(response.body)
      return response
    })
  }


updateProductWithValidation(id: number, productData: any, expectSuccess: boolean = true) {
  
  return this.updateProduct(id, productData).then((response) => {
    if (expectSuccess) {
      ValidationHelpers.validateStatusCode(response.status, 200)
      ValidationHelpers.validateProductStructure(response.body)
      expect(response.body.id).to.equal(id, `Product ID should remain ${id}`)
      
      // Verify sent data is reflected in response
      Object.keys(productData).forEach(key => {
        if (key !== 'id') { // ID should not change
          expect(response.body[key]).to.deep.equal(productData[key], 
            `Field '${key}' should be updated to '${productData[key]}'`)
        }
      })
    } else {
      expect(response.status).to.be.oneOf([200, 400, 422, 500])

    }
    return response
  })
}

  patchProductWithValidation(id: number, patchData: any, expectSuccess: boolean = true) {

    return this.patchProduct(id, patchData).then((response) => {
      if (expectSuccess) {
        ValidationHelpers.validateStatusCode(response.status, 200)
        ValidationHelpers.validateProductStructure(response.body)
        expect(response.body.id).to.equal(id, `Product ID should remain ${id}`)
      
        // Verify only patched fields are updated
        Object.keys(patchData).forEach(key => {
          if (key !== 'id') { // ID should not change
            expect(response.body[key]).to.deep.equal(patchData[key],
              `Patched field '${key}' should be updated to '${patchData[key]}'`)
          }
        })
      } else {
        // For invalid data, expect error responses (or 200 for DummyJSON)
        expect(response.status).to.be.oneOf([200, 400, 422, 500])

      }
      return response
  })
}


deleteProductWithValidation(id?: number) {
  const productId = id || TestDataManager.getValidProductId()

  return this.deleteProduct(productId).then((response) => {
    ValidationHelpers.validateStatusCode(response.status, 200)
    expect(response.body).to.have.property('id', productId)  
    expect(response.body).to.have.property('isDeleted', true)
    expect(response.body).to.have.property('deletedOn')
    return response
  })
}

updateProductWithRandomValidData(id?: number) {
  const productId = id || TestDataManager.getValidProductId()
  const testDataSets = TestDataManager.getPostTestDataSets()
  const validProduct = testDataSets.validProducts[Math.floor(Math.random() * testDataSets.validProducts.length)]
  
  return this.updateProductWithValidation(productId, validProduct, true)
}


updateProductWithRandomEdgeCaseData(id?: number) {
  const productId = id || TestDataManager.getValidProductId()
  const testDataSets = TestDataManager.getPostTestDataSets()
  const edgeCaseProduct = testDataSets.edgeCaseProducts[Math.floor(Math.random() * testDataSets.edgeCaseProducts.length)]
  
  return this.updateProductWithValidation(productId, edgeCaseProduct, true)
}

patchProductWithRandomValidData(id?: number) {
  const productId = id || TestDataManager.getValidProductId()
  // For PATCH, we'll use partial data from valid products
  const testDataSets = TestDataManager.getPostTestDataSets()
  const validProduct = testDataSets.validProducts[Math.floor(Math.random() * testDataSets.validProducts.length)]
  
  // Extract only a few fields for PATCH (not full product)
  const patchFields = ['title', 'price', 'description', 'category', 'stock']
  const selectedFields = patchFields.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1)
  
  const patchData: any = {}
  selectedFields.forEach(field => {
    if (validProduct[field] !== undefined) {
      patchData[field] = validProduct[field]
    }
  })
  
  return this.patchProductWithValidation(productId, patchData, true)
}


  //Negative tests
  //****************************************************************************************************************/
  getNonExistentProduct(id: any) {
    
    return cy.apiRequest({
      method: HttpMethod.GET,
      url: `${this.productsUrl}/${id}`,
      failOnStatusCode: false
    })
  }

  getInvalidCategory(category: string) {

    return cy.apiRequest({
      method: HttpMethod.GET,
      url: `${this.singleCategoryUrl}/${category}`,
      failOnStatusCode: false
    })
  }


  getProductByInvalidIdWithValidation(id: any) {
      return this.getNonExistentProduct(id).then((response) => {
      ValidationHelpers.validateStatusCode(response.status, 404)
      ValidationHelpers.validateNotFoundMessage(response.body, id, 'Product')
      return response
    })
  }

  getNonExistentCategoryWithValidation(category: string) {
    return this.getInvalidCategory(category).then((response) => {
      ValidationHelpers.validateStatusCode(response.status, 200)
      expect(response.body).to.have.property('products').to.be.an('array').and.be.empty
      expect(response.body).to.have.property('total', 0)
      expect(response.body).to.have.property('skip', 0)
      expect(response.body).to.have.property('limit', 0)
      return response
    })
  }
  
  updateProductWithRandomInvalidData(id?: number) {
  const productId = id || TestDataManager.getValidProductId()
  const testDataSets = TestDataManager.getPostTestDataSets()
  const invalidProduct = testDataSets.invalidProducts[Math.floor(Math.random() * testDataSets.invalidProducts.length)]
  
  return this.updateProductWithValidation(productId, invalidProduct, false)
}

patchProductWithRandomInvalidData(id?: number) {
  const productId = id || TestDataManager.getValidProductId()
  const testDataSets = TestDataManager.getPostTestDataSets()
  const invalidProduct = testDataSets.invalidProducts[Math.floor(Math.random() * testDataSets.invalidProducts.length)]
  
  // Extract a few invalid fields for PATCH
  const invalidFields = Object.keys(invalidProduct)
  const selectedField = invalidFields[Math.floor(Math.random() * invalidFields.length)]
  const patchData = { [selectedField]: invalidProduct[selectedField] }
  
  return this.patchProductWithValidation(productId, patchData, false)
}

deleteProductWithRandomInvalidId() {
  const id = TestDataManager.getMaxId() + 1 // Get a non-existent ID
    
  return this.deleteProduct(id).then((response) => {
      ValidationHelpers.validateStatusCode(response.status, 404)
      ValidationHelpers.validateNotFoundMessage(response.body, id, 'Product')
      return response
    })
}


}