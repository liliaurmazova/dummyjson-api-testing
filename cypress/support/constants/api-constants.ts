export class ApiConstants {

  // Endpoints
  static readonly PRODUCTS = `/products`
  static readonly CATEGORIES = `${ApiConstants.PRODUCTS}/categories`
  static readonly SINGLE_CATEGORY = `${ApiConstants.PRODUCTS}/category`
  static readonly CATEGORY_LIST = `${ApiConstants.PRODUCTS}/category-list`
  static readonly SEARCH = `${ApiConstants.PRODUCTS}/search?q=`
  static readonly ADD_PRODUCT = `${ApiConstants.PRODUCTS}/add`

  // Common headers
  static readonly HEADERS = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
}
