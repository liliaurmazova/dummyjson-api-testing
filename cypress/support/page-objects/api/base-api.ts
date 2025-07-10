import { ApiRequestOptions } from "@/support/types/test-types"
import { ApiHelpers } from "@/support/helpers/api-helpers"

export abstract class BaseAPI {
  protected abstract baseEndpoint: string
  
  protected makeRequest(options: ApiRequestOptions) {
    return cy.apiRequest({
      ...options,
      url: `${this.baseEndpoint}${options.url}`
    })
  }
  
  protected buildUrl(endpoint: string, params?: Record<string, any>): string {
     return ApiHelpers.buildUrl(this.baseEndpoint, endpoint, params)
  }
}