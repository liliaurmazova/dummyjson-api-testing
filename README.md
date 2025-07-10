# DummyJSON API Testing Framework

A comprehensive API testing framework built with Cypress and TypeScript for testing the DummyJSON API.

## Project Structure

```
DummyJsonDeepOrigin/
├── cypress/
│   ├── e2e/                          # End-to-end test files
│   │   └── api/                      # API-specific tests
│   │       └── products/             # Product-related tests
│   │           ├── get-products.cy.ts      # GET products tests
│   │           ├── get-categories.cy.ts    # GET categories tests
│   │           ├── post-products.cy.ts     # POST products tests
│   │           ├── update-products.cy.ts   # PUT/PATCH products tests
│   │           └── delete-products.cy.ts   # DELETE products tests
│   │
│   ├── support/                      # Support files and utilities
│   │   ├── commands/                 # Custom Cypress commands
│   │   ├── constants/                # API constants and enums
│   │   ├── factories/                # Data factories
│   │   ├── helpers/                  # Helper functions
│   │   ├── managers/                 # Test data managers
│   │   ├── page-objects/             # Page Object Model
│   │   └── types/                    # TypeScript definitions
│   │
├── config/                           # Configuration files (TODO)
├── scripts/                          # Utility scripts (TODO)
└── reports/                          # Test reports
```

## Features

- **TypeScript Support**: Full TypeScript integration
- **Page Object Model**: Clean API abstraction
- **Comprehensive Validation**: Response structure validation
- **Data Generation**: Dynamic test data creation
- **Error Handling**: Robust negative testing
- **Modular Architecture**: Reusable components

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```

## Running Tests

### Product Tests
```bash
npm run test:products
```

### Interactive Mode
```bash
npx cypress open
```

### Specific Test File
```bash
npx cypress run --spec "cypress/e2e/api/products/get-products.cy.ts"
```

## API Coverage

### Products API
- ✅ GET `/products` - Product listing with pagination
- ✅ GET `/products/{id}` - Single product retrieval
- ✅ GET `/products/search` - Product search
- ✅ GET `/products/category/{category}` - Category filtering
- ✅ GET `/products/categories` - Category listing
- ✅ POST `/products/add` - Product creation
- ✅ PUT `/products/{id}` - Product update
- ✅ PATCH `/products/{id}` - Partial product update
- ✅ DELETE `/products/{id}` - Product deletion

## Test Features

### Positive Testing
- Product structure validation
- Pagination parameter testing
- Field selection validation
- Category filtering
- Search functionality

### Negative Testing
- Invalid product IDs
- Invalid categories
- Invalid search terms
- Invalid data validation
- Error response validation

## Known Issues

### Failed Test (API Defect)
**File**: `cypress/e2e/api/products/get-products.cy.ts`
**Test**: "should handle invalid search term"
**Issue**: Empty search strings return all products instead of empty results
**Status**: DummyJSON API behavior - not a test issue

### Blinked Test (API Defect)
**File**: `cypress/e2e/api/products/get-categories.cy.ts`
**Test**: "should handle invalid category"
**Issue**: Response code blinks: 200 or 400. Don't want to use "one of", because this is not an expected behaviour. 
**Status**: DummyJSON API behavior - not a test issue

## TODO

- [ ] **Logger Implementation**: Structured logging system
- [ ] **URL Builder**: Enhanced URL construction utilities  
- [ ] **Environment Configuration**: Complete production.json
- [ ] **Test Data Setup**: Implement setup scripts

## Custom Commands

- `cy.apiRequest()`: Enhanced API request with default headers
- `cy.validateApiResponse()`: Response structure validation

## Helper Classes

- **ProductsAPI**: Complete products API abstraction
- **ValidationHelpers**: Response validation utilities
- **TestDataManager**: Centralized test data management
- **DataGenerators**: Dynamic test data creation

## Best Practices Implemented

1. **Type Safety**: Comprehensive TypeScript typing
2. **DRY Principle**: Reusable components and utilities
3. **Page Object Model**: Clean API interaction patterns
4. **Factory Pattern**: Consistent test data generation
5. **Validation Layers**: Structured response validation

## Contributing

1. Follow the established folder structure
2. Add TypeScript types for new features
3. Include both positive and negative test cases
4. Update validation helpers for new endpoints