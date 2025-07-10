import { ProductFactory } from "../factories/product-factory"
import { DataGenerator } from "../helpers/data-generators"

export class TestDataManager {
  private static productFactory = new ProductFactory()
  private static maxID = 194

  static getMaxId() {
    return this.maxID
  }
  
  static createTestSuite(testType: 'smoke' | 'regression') {
    switch (testType) {
      case 'smoke':
        return {
          products: this.productFactory.createSmokeTestData(),
        }
      case 'regression':
        return {
          products: this.productFactory.createRegressionTestData(),
        }
    }
  }
  
  static createDummyJsonTestSuite() {
    return {
      
      // Invalid IDs 
      invalidProductIds: [99999, -1, 0],
      
      // Invalid categories for error testing
      invalidCategories: ['nonexistent', 'fake-category', ''],
      
      // Search terms that return results
      validSearchTerms: ['phone'],
      // Search terms that return no results
      invalidSearchTerms: ['xyzabc123', ''],
      
      // Pagination parameters for testing
      paginationTests: [
        { limit: 10, skip: 0 },
        { limit: 5, skip: 10 },
        { limit: 1, skip: 0 },
        { limit: 30, skip: 0 }, // Default values
        { limit: 50, skip: 20 }
      ],
      
      // Edge case pagination
      edgeCasePagination: [
        { limit: 0, skip: 0 },     // Zero limit and skip
        { limit: this.maxID, skip: 0 },  // Max limit
        { limit: 10, skip: this.maxID-1 }, // Max skip
      ],
      
      
      // Select fields for testing
      selectFields: [
        ['id', 'title', 'price'],
        ['title', 'description', 'category'],
        ['id', 'price', 'discountPercentage', 'rating'],
        ['title', 'brand', 'category', 'stock']
      ],
      
      // Sort options
      sortOptions: [
        { sortBy: 'title', order: 'asc' },
        { sortBy: 'title', order: 'desc' },
        { sortBy: 'price', order: 'asc' },
        { sortBy: 'price', order: 'desc' },
        { sortBy: 'rating', order: 'desc' },
        { sortBy: 'rating', order: 'asc' }
      ]
      
    }
  }



  /**
   * Generate random product data for POST requests
   */
  static generateRandomProductForPost(): any {

    return {
      title: `${DataGenerator.generateRandomString(8)} Product ${Math.floor(Math.random() * 1000)}`,
      description: this.getRandomDescription(),
      price: Math.round((Math.random() * 999 + 1) * 100) / 100, // 1.00 to 999.99
      discountPercentage: Math.round(Math.random() * 50 * 100) / 100, // 0 to 50%
      rating: Math.round((Math.random() * 4 + 1) * 100) / 100, // 1.00 to 5.00
      stock: Math.floor(Math.random() * 100) + 1, // 1 to 100
      brand: this.getRandomBrand(),
      category: this.getRandomCategory(),
      thumbnail: `https://i.imgur.com/${DataGenerator.generateRandomString(7)}.jpg`,
      images: [
        `https://i.imgur.com/${DataGenerator.generateRandomString(7)}.jpg`,
        `https://i.imgur.com/${DataGenerator.generateRandomString(7)}.jpg`
      ]
    }
  }

  static generateRandomProductForPatch(): any {

    return {
      title: `${DataGenerator.generateRandomString(8)} Product ${Math.floor(Math.random() * 1000)}`,
      description: this.getRandomDescription(),
      price: Math.round((Math.random() * 999 + 1) * 100) / 100, // 1.00 to 999.99
      category: this.getRandomCategory(),
      thumbnail: `https://i.imgur.com/${DataGenerator.generateRandomString(7)}.jpg`,
      images: [
        `https://i.imgur.com/${DataGenerator.generateRandomString(7)}.jpg`,
        `https://i.imgur.com/${DataGenerator.generateRandomString(7)}.jpg`
      ]
    }
  }

  /**
   * Generate product data with specific constraints
   */
  static generateProductForPost(options?: {
    category?: string
    priceRange?: { min: number; max: number }
    withValidData?: boolean
    titleLength?: number
  }) {
    const { 
      category = this.getRandomCategory(), 
      priceRange = { min: 1, max: 999 },
      withValidData = true,
      titleLength = 20
    } = options || {}

    if (withValidData) {
      return {
        title: DataGenerator.generateRandomString(titleLength),
        description: `Test product description for ${category} category`,
        price: Math.round((Math.random() * (priceRange.max - priceRange.min) + priceRange.min) * 100) / 100,
        discountPercentage: Math.round(Math.random() * 30 * 100) / 100,
        rating: Math.round((Math.random() * 4 + 1) * 100) / 100,
        stock: Math.floor(Math.random() * 50) + 10,
        brand: this.getRandomBrand(),
        category: category,
        thumbnail: this.generateRandomImageUrl(),
        images: this.generateRandomImageArray(2)
      }
    } else {
      // Generate invalid data for negative testing
      return this.generateInvalidProductData()
    }
  }

  /**
   * Generate invalid product data for negative testing
   */
  static generateInvalidProductData(): any {
    const invalidOptions = [
      { title: '' }, // Empty title
      { title: 'A'.repeat(300) }, // Too long title
      { price: -10 }, // Negative price
      { price: 0 }, // Zero price
      { stock: -5 }, // Negative stock
      { rating: 6 }, // Invalid rating > 5
      { rating: -1 }, // Invalid rating < 0
      { discountPercentage: -10 }, // Negative discount
      { discountPercentage: 101 }, // Discount > 100%
      { category: 'invalid-category' }, // Non-existent category
      { brand: '' }, // Empty brand
      {} // Empty object
    ]

    const baseProduct = this.generateRandomProductForPost()
    const invalidOption = invalidOptions[Math.floor(Math.random() * invalidOptions.length)]
    
    return { ...baseProduct, ...invalidOption }
  }

  /**
   * Generate test data sets for different scenarios
   */
  static getPostTestDataSets() {
    return {
      validProducts: [
        this.generateProductForPost({ category: 'smartphones' }),
        this.generateProductForPost({ category: 'laptops' }),
        this.generateProductForPost({ category: 'fragrances' }),
        this.generateProductForPost({ priceRange: { min: 100, max: 500 } }),
        this.generateProductForPost({ titleLength: 50 })
      ],
      
      invalidProducts: [
        this.generateInvalidProductData(),
        this.generateInvalidProductData(),
        this.generateInvalidProductData(),
        { title: '', price: -1, stock: -1 }, // Multiple invalid fields
        { invalidField: 'should not exist' } // Unknown field
      ],
      
      edgeCaseProducts: [
        { ...this.generateProductForPost(), price: 0.01 }, // Minimum price
        { ...this.generateProductForPost(), price: 99999.99 }, // Maximum price
        { ...this.generateProductForPost(), stock: 0 }, // Zero stock
        { ...this.generateProductForPost(), discountPercentage: 0 }, // No discount
        { ...this.generateProductForPost(), discountPercentage: 99.99 }, // Maximum discount
        { ...this.generateProductForPost(), title: 'A' }, // Single character title
        { ...this.generateProductForPost(), title: 'A'.repeat(255) } // Very long title
      ]
    }
  }

  /**
   * Helper methods
   */
  private static getRandomBrand(): string {
    const brands = [
      'Essence', 
      'Glamour Beauty', 
      'Velvet Touch', 
      'Chic Cosmetics', 
      'Nail Couture', 
      'Calvin Klein', 
      'Chanel', 
      'Dior', 
      'Dolce & Gabbana'
    ]
    return brands[Math.floor(Math.random() * brands.length)]
  }

  private static getRandomDescription(): string {
    const descriptions = [
      'High quality product with excellent features',
      'Premium product designed for everyday use',
      'Innovative solution for modern lifestyle',
      'Best-in-class product with superior performance',
      'Affordable option with great value',
      'Professional grade product for demanding users'
    ]
    return descriptions[Math.floor(Math.random() * descriptions.length)]
  }

  private static getRandomCategory(): string {
    const categories = [
      'beauty',
      'fragrances',
      'furniture',
      'groceries',
      'home-decoration',
      'kitchen-accessories',
      'laptops',
      'mens-shirts',
      'mens-shoes',
      'mens-watches',
      'mobile-accessories',
      'motorcycle',
      'skin-care',
      'smartphones',
      'sports-accessories',
      'sunglasses',
      'tablets',
      'tops',
      'vehicle',
      'womens-bags',
      'womens-dresses',
      'womens-jewellery',
      'womens-shoes',
      'womens-watches'
    ]
    return categories[Math.floor(Math.random() *  categories.length)]
  }

  private static generateRandomImageUrl(): string {
    return `https://i.imgur.com/${DataGenerator.generateRandomString(7)}.jpg`
  }

  private static generateRandomImageArray(count: number): string[] {
    return Array.from({ length: count }, () => this.generateRandomImageUrl())
  }

  private static generateRandomProductId(): number {
    return Math.floor(Math.random() * this.maxID) + 1 // Random ID between 1 and current maximal ID
  }




  /**
   * Get test data for specific scenarios
   */
  static getValidProductId(): number {
    return this.generateRandomProductId()
  }
  
  static getInvalidProductId(): number {
    const invalidIds = this.createDummyJsonTestSuite().invalidProductIds
    return invalidIds[Math.floor(Math.random() * invalidIds.length)]
  }
  
  static getValidCategory(): string {
    return this.getRandomCategory()
  }
  
  static getInvalidCategory(): string {
    const invalidCategories = this.createDummyJsonTestSuite().invalidCategories
    return invalidCategories[Math.floor(Math.random() * invalidCategories.length)]
  }
  
  static getValidSearchTerm(): string {
    const validTerms = this.createDummyJsonTestSuite().validSearchTerms
    return validTerms[Math.floor(Math.random() * validTerms.length)]
  }
  
  static getInvalidSearchTerm(): string {
    const invalidTerms = this.createDummyJsonTestSuite().invalidSearchTerms
    return invalidTerms[Math.floor(Math.random() * invalidTerms.length)]
  }

   static getRandomPaginationParams(): { limit: number; skip: number } {
    const paginationTests = this.createDummyJsonTestSuite().paginationTests
    return paginationTests[Math.floor(Math.random() * paginationTests.length)]
  }

   static edgeCasePaginationParams(): { limit: number; skip: number } {
    const paginationTests = this.createDummyJsonTestSuite().edgeCasePagination
    return paginationTests[Math.floor(Math.random() * paginationTests.length)]
  }
  
  static getRandomSelectFields(): string[] {
    const selectFields = this.createDummyJsonTestSuite().selectFields
    return selectFields[Math.floor(Math.random() * selectFields.length)]
  }


  
  /**
   * Create test data for different test types
   */
  static createSmokeTestData() {
    return {
      productId: 1,
      category: 'smartphones',
      searchTerm: 'phone',
      pagination: { limit: 10, skip: 0 },
      selectFields: ['id', 'title', 'price']
    }
  }
  
  static createRegressionTestData() {
    return {
      validProductIds: this.getValidProductId,
      invalidProductIds: this.createDummyJsonTestSuite().invalidProductIds.slice(0, 3),
      validCategories: this.getValidCategory(),
      invalidCategories: this.createDummyJsonTestSuite().invalidCategories,
      paginationTests: this.createDummyJsonTestSuite().paginationTests,
      edgeCasePagination: this.createDummyJsonTestSuite().edgeCasePagination,
      searchTerms: this.createDummyJsonTestSuite().validSearchTerms,
      invalidSearchTerms: this.createDummyJsonTestSuite().invalidSearchTerms
    }
  }
  
   private static createDefaultTestData() {
    return {
      products: this.productFactory.createSmokeTestData(),
      testData: this.createDummyJsonTestSuite()
    }
  }

}