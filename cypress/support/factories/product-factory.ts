import { BaseFactory } from './base-factory'
import { DataGenerator } from 'cypress/support/helpers/data-generators'
import { Product } from '../types/api-types'

export class ProductFactory extends BaseFactory<Product> {
  create(overrides?: Partial<Product>): Product {
    const base = DataGenerator.generateProduct()
    return this.merge(base as Product, overrides)
  }
  
  createMany(count: number, overrides?: Partial<Product>): Product[] {
    return Array.from({ length: count }, () => this.create(overrides))
  }
  
  createSmokeTestData() {
    return {
      validProduct: this.create({ category: 'smartphones' }),
      popularProduct: this.create({ rating: 4.5, stock: 100 }),
      outOfStockProduct: this.create({ stock: 0, availabilityStatus: 'Out of Stock' })
    }
  }
  
  createRegressionTestData() {
    return {
      ...this.createSmokeTestData(),
      edgeCaseProducts: [
        this.create({ price: 0.01 }), // Minimum price
        this.create({ price: 99999.99 }), // Maximum price
        this.create({ title: 'A'.repeat(255) }) // Long title
      ]
    }
  }
}