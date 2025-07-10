export abstract class BaseFactory<T> {
  abstract create(overrides?: Partial<T>): T
  abstract createMany(count: number, overrides?: Partial<T>): T[]
  
  protected merge(base: T, overrides?: Partial<T>): T {
    return { ...base, ...overrides }
  }
}