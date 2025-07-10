import { Product } from '../types/api-types'

/**
 * Generate test data for API requests
 */
export class DataGenerator {
  
  

  /**
   * Generate a random product object
   */
  static generateProduct(): Partial<Product> {
    const randomId = Math.floor(Math.random() * 10000)
    const categories = ['beauty', 'fragrances', 'furniture', 'home-decoration', 'kitchen-accessories', 'laptops', 'mens-shirts', 'mens-shoes', 'smartphones', 'womens-dresses']
    const brands = ['Essence', 'Glamour Beauty', 'Velvet Touch', 'Chic Cosmetics', 'Nail Couture', 'Apple', 'Samsung', 'Sony']
    const selectedCategory = categories[Math.floor(Math.random() * categories.length)]
    
    return {
      id: randomId,
      title: `Test Product ${randomId}`,
      description: `This is a test product description for product ${randomId}`,
      category: selectedCategory,
      price: Math.floor(Math.random() * 1000) + 10,
      discountPercentage: Math.round((Math.random() * 50) * 100) / 100,
      rating: Math.round((Math.random() * 4 + 1) * 100) / 100,
      stock: Math.floor(Math.random() * 100) + 1,
      tags: this.generateTags(selectedCategory),
      brand: brands[Math.floor(Math.random() * brands.length)],
      sku: this.generateSKUWithCategory(selectedCategory),
      weight: this.generateWeight(),
      dimensions: this.generateDimensions(),
      warrantyInformation: this.generateWarrantyInfo(),
      shippingInformation: this.generateShippingInfo(),
      availabilityStatus: this.generateAvailabilityStatus(),
      reviews: this.generateReviews(),
      returnPolicy: this.generateReturnPolicy(),
      minimumOrderQuantity: this.generateMinOrderQuantity(),
      meta: this.generateMeta(),
      images: this.generateImages(randomId),
      thumbnail: this.generateThumbnail(randomId)
    }
  }

  /**
   * Generate random string of specified length
   */
  static generateRandomString(length: number = 10): string {
    
    if (length <= 0) return ''
    if (length > 100) throw new Error('Length must be between 1 and 100 characters')

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  /**
   * Generate tags based on category
   */
  static generateTags(category: string): string[] {
    const tagMap: Record<string, string[]> = {
      'beauty': ['beauty', 'cosmetics', 'makeup'],
      'fragrances': ['fragrance', 'perfume', 'scent'],
      'furniture': ['furniture', 'home', 'decor'],
      'home-decoration': ['decoration', 'home', 'accessories'],
      'kitchen-accessories': ['kitchen', 'cooking', 'utensils'],
      'laptops': ['electronics', 'computer', 'laptop'],
      'mens-shirts': ['clothing', 'mens', 'shirts'],
      'mens-shoes': ['footwear', 'mens', 'shoes'],
      'smartphones': ['electronics', 'phone', 'mobile'],
      'womens-dresses': ['clothing', 'womens', 'dresses']
    } 

    const baseTags = tagMap[category] || ['product', 'general']
    const additionalTags = ['popular', 'new', 'featured', 'bestseller']

    // Return 2-4 tags
    const numTags = Math.floor(Math.random() * 3) + 2
    const selectedTags = [...baseTags]
    
    if (numTags > baseTags.length) {
      const extraTags = additionalTags
        .sort(() => 0.5 - Math.random())
        .slice(0, numTags - baseTags.length)
      selectedTags.push(...extraTags)
    }
    
    return selectedTags.slice(0, numTags)
}

/**
   * Generate product weight
   */
  static generateWeight(): number {
    return Math.round((Math.random() * 50 + 0.1) * 100) / 100
  }

  /**
   * Generate product dimensions
   */
  static generateDimensions(): { width: number; height: number; depth: number } {
    return {
      width: Math.round((Math.random() * 50 + 1) * 100) / 100,
      height: Math.round((Math.random() * 50 + 1) * 100) / 100,
      depth: Math.round((Math.random() * 50 + 1) * 100) / 100
    }
  }

  /**
   * Generate warranty information
   */
  static generateWarrantyInfo(): string {
    const warranties = [
      '1 week warranty',
      '30 days warranty',
      '6 months warranty',
      '1 year warranty',
      '2 years warranty',
      'No warranty',
      'Lifetime warranty'
    ]
    
    return warranties[Math.floor(Math.random() * warranties.length)]
  }

  /**
   * Generate shipping information
   */
  static generateShippingInfo(): string {
    const shippingOptions = [
      'Ships in 1-2 business days',
      'Ships in 3-5 business days',
      'Ships in 5-7 business days',
      'Ships in 1 week',
      'Same day delivery available',
      'Free shipping on orders over $50'
    ]
    
    return shippingOptions[Math.floor(Math.random() * shippingOptions.length)]
  }

  /**
   * Generate availability status
   */
  static generateAvailabilityStatus(): string {
    const statuses = [
      'In Stock',
      'Low Stock',
      'Out of Stock',
      'Pre-order',
      'Discontinued'
    ]
    
    // Weight towards "In Stock" (80% chance)
    const random = Math.random()
    if (random < 0.8) return 'In Stock'
    
    return statuses[Math.floor(Math.random() * statuses.length)]
  }

  /**
   * Generate product reviews
   */
  static generateReviews(): Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }> {
    const comments = [
      'Excellent product!',
      'Very satisfied!',
      'Good value for money',
      'Would recommend!',
      'Not what I expected',
      'Could be better',
      'Amazing quality!',
      'Fast shipping',
      'Highly impressed!',
      'Would not recommend!',
      'Perfect for my needs',
      'Great customer service'
    ]

    const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emma', 'Chris', 'Lisa', 'Tom', 'Anna', 'Lucas', 'Eleanor']
    const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Garcia', 'Miller', 'Taylor', 'Anderson', 'Collins', 'Gordon', 'Martinez']
    
    const numReviews = Math.floor(Math.random() * 5) + 1 // 1-5 reviews
    const reviews = []
    
    for (let i = 0; i < numReviews; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const reviewerName = `${firstName} ${lastName}`
      const reviewerEmail = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@x.dummyjson.com`
      
      reviews.push({
        rating: Math.floor(Math.random() * 5) + 1,
        comment: comments[Math.floor(Math.random() * comments.length)],
        date: this.generateRandomDate().toISOString(),
        reviewerName: reviewerName,
        reviewerEmail: reviewerEmail
      })
    }
    
    return reviews
  }

  /**
   * Generate return policy
   */
  static generateReturnPolicy(): string {
    const policies = [
      'No return policy',
      '30 days return policy',
      '60 days return policy',
      '90 days return policy',
      'Returns accepted within 14 days',
      'Exchange only, no returns',
      'Full refund if not satisfied'
    ]
    
    return policies[Math.floor(Math.random() * policies.length)]
  }

  /**
   * Generate minimum order quantity
   */
  static generateMinOrderQuantity(): number {
    const quantities = [1, 5, 10, 12, 24, 48, 50, 100]
    return quantities[Math.floor(Math.random() * quantities.length)]
  }

  /**
   * Generate meta information
   */
  static generateMeta(): {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  } {
    const now = new Date()
    const createdAt = this.generateRandomDate(new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000), now)
    const updatedAt = this.generateRandomDate(createdAt, now)
    
    return {
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      barcode: this.generateBarcode(),
      qrCode: 'https://cdn.dummyjson.com/public/qr-code.png'
    }
  }

  /**
   * Generate product images array
   */
  static generateImages(productId: number): string[] {
    const numImages = Math.floor(Math.random() * 3) + 1 // 1-3 images
    const images = []
    
    for (let i = 1; i <= numImages; i++) {
      images.push(`https://cdn.dummyjson.com/product-images/test-product-${productId}/${i}.webp`)
    }
    
    return images
  }

  /**
   * Generate thumbnail URL
   */
  static generateThumbnail(productId: number): string {
    return `https://cdn.dummyjson.com/product-images/test-product-${productId}/thumbnail.webp`
  }

  /**
   * Generate random date between two dates
   */
  static generateRandomDate(start: Date = new Date(2023, 0, 1), end: Date = new Date()): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  }

  /**
   * Generate barcode (13 digits)
   */
  static generateBarcode(): string {
    let barcode = ''
    for (let i = 0; i < 13; i++) {
      barcode += Math.floor(Math.random() * 10)
    }
    return barcode
  }

  /**
   * Regular expression to validate SKU format
   */
  static readonly SKU_REGEX = /^[A-Z]{3}-[A-Z]{3}-[A-Z]{3}-\d{3}$/

  /**
   * Validate if a string matches the SKU format
   */
  static isValidSKU(sku: string): boolean {
    return this.SKU_REGEX.test(sku)
  }

  
  /**
   * Generate SKU with specific category prefix
   */
  static generateSKUWithCategory(category: string): string {
    const categoryMap: Record<string, string> = {
      'beauty': 'BEA',
      'fragrances': 'FRA',
      'furniture': 'FUR',
      'home-decoration': 'HOM',
      'kitchen-accessories': 'KIT',
      'laptops': 'LAP',
      'mens-shirts': 'MEN',
      'mens-shoes': 'SHO',
      'smartphones': 'SMT',
      'womens-dresses': 'WOM'
    }
    
    if(!category || typeof category !== 'string' || !Object.keys(categoryMap).includes(category)) {
        throw new Error('Invalid category provided: ${category}')
    }
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const categoryCode = categoryMap[category] 
    
    // Generate two more letter groups
    const group2 = Array.from({length: 3}, () => letters[Math.floor(Math.random() * letters.length)]).join('')
    const group3 = Array.from({length: 3}, () => letters[Math.floor(Math.random() * letters.length)]).join('')
    
    // Generate number group (001-999)
    const numberGroup = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')
    
    return `${categoryCode}-${group2}-${group3}-${numberGroup}`
  }
}