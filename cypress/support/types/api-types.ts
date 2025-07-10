// API Types

//Product type according to the GET response json structure
export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand: string
  category: string
  thumbnail?: string
  images?: string[]
  sku: string
  weight?: number
  dimensions?: {
    width: number
    height: number
    depth: number
  }
  warrantyInformation?: string
  shippingInformation?: string
  availabilityStatus: string
  reviews?: Array<
    {
      rating: number
      comment: string
      date: string
      reviewerName: string
      reviewerEmail: string
    }
  >
  returnPolicy?: string
  minimumOrderQuantity: number
  meta?: {
    createdAt: string
    updatedAt: string
    barcode: string
    qrCode: string
  } 

}


//API response structure
export interface ApiResponse<T> {
  data: T
  message?: string
  status: number
}

//Paginated response structure
export interface DummyJsonPaginatedResponse<T> {
  products: T[]  // DummyJSON uses 'products'
  total: number
  skip: number
  limit: number
}


