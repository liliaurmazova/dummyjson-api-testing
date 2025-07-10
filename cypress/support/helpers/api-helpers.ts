/**
 * API helper functions for common operations
 */
export class ApiHelpers {
  
  /**
   * Build URL with query parameters
   */
  static buildUrl(baseUrl: string, endpoint: string, params: Record<string, any> | undefined): string {
    const url = new URL(baseUrl, Cypress.env('apiUrl'))
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key].toString())
        }
      })
    }
    return url.toString()
  }

  /**
   * Extract specific fields from response body
   */
  static extractFields<T>(data: any, fields: string[]): Partial<T> {
    const result: any = {}
    fields.forEach(field => {
      if (data.hasOwnProperty(field)) {
        result[field] = data[field]
      }
    })
    return result as Partial<T>
  }

  /**
   * Validate required fields exist in object
   */
  static validateRequiredFields(obj: any, requiredFields: string[]): boolean {
    return requiredFields.every(field => 
      obj.hasOwnProperty(field) && obj[field] !== null && obj[field] !== undefined
    )
  }

  /**
   * Sort array of objects by specified field
   */
  static sortByField<T>(array: T[], field: keyof T, ascending: boolean = true): T[] {
    return array.sort((a, b) => {
      const aVal = a[field]
      const bVal = b[field]
      
      if (aVal < bVal) return ascending ? -1 : 1
      if (aVal > bVal) return ascending ? 1 : -1
      return 0
    })
  }

  /**
   * Filter array by multiple criteria
   */
  static filterBy<T>(array: T[], filters: Partial<T>): T[] {
    return array.filter(item => {
      return Object.keys(filters).every(key => {
        const filterValue = filters[key as keyof T]
        const itemValue = item[key as keyof T]
        return filterValue === itemValue
      })
    })
  }



  /**
   * Check if response is paginated
   */
  static isPaginatedResponse(response: any): boolean {
    return response && 
           typeof response === 'object' && 
           'total' in response && 
           'skip' in response && 
           'limit' in response
  }
}
