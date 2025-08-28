# Product Filters API

## Overview

The Product Filters API provides comprehensive filtering capabilities for the main products endpoint. Users can filter products by multiple criteria including type, price, capacity, brand, location, and more.

## Endpoint

```
GET /products
```

## Parameters

### Pagination Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | ❌ | 1 | Page number for pagination |
| `limit` | number | ❌ | 20 | Number of products per page |
| `lang` | string | ❌ | 'en' | Language: `en`, `ar` |

### Filter Parameters (All Optional)

#### Product Type Filters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `types` | string | Comma-separated product types | `jetski,kayak,yacht,speedboat,resort` |

#### Price Filters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `minPrice` | number | Minimum price | `100` |
| `maxPrice` | number | Maximum price | `1000` |
| `pricingType` | string | Pricing type: `perHour`, `perDay`, `daily`, `yearly` | `perHour` |

#### Capacity Filters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `minCapacity` | number | Minimum capacity (people) | `2` |
| `maxCapacity` | number | Maximum capacity (people) | `8` |

#### Brand & Location Filters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `brands` | string | Comma-separated brands | `Yamaha,Sea Ray` |
| `cities` | string | Comma-separated cities | `Dubai,Abu Dhabi` |

#### Product-Specific Filters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `yachtTypes` | string | Yacht types (motor, sailing, catamaran) | `motor,sailing` |
| `resortTypes` | string | Resort types (daily, annual, event) | `daily,annual` |
| `starRating` | number | Minimum star rating (resorts) | `4` |
| `amenities` | string | Comma-separated amenities | `WiFi,Parking,Pool` |
| `isDailyResort` | boolean | Daily resort filter (true/false) | `true` |
| `isAnnualResort` | boolean | Annual resort filter (true/false) | `true` |
| `canHostEvent` | boolean | Event hosting filter (true/false) | `true` |

#### Content Filters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `tags` | string | Comma-separated tags | `luxury,family,romantic` |
| `search` | string | Search in title and description | `luxury yacht` |

## Response Format

### Success Response
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "titleEn": "Luxury Yacht",
      "titleAr": "يخت فاخر",
      "title": "Luxury Yacht",
      "type": "yacht",
      "pricePerHour": 150,
      "pricePerDay": 1200,
      "dailyPrice": 300,
      "capacity": 8,
      "brand": "Sea Ray",
      "cityEn": "Dubai",
      "cityAr": "دبي",
      "yachtType": "motor",
      "starRating": 5,
      "amenitiesEn": ["WiFi", "Parking"],
      "tagsEn": ["luxury", "family"],
      "images": ["image_urls"],
      "videos": ["video_urls"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "filters": {
    "applied": {
      "types": ["yacht"],
      "minPrice": 100,
      "maxPrice": 500,
      "cities": ["Dubai"]
    },
    "totalResults": 25
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Failed to get products",
  "error": "Invalid filter parameter"
}
```

## Examples

### Basic Filtering

#### Get Only Yachts
```bash
curl "http://localhost:3000/products?types=yacht"
```

#### Get Yachts and Jetskis
```bash
curl "http://localhost:3000/products?types=yacht,jetski"
```

#### Filter by Price Range (Default)
```bash
curl "http://localhost:3000/products?minPrice=100&maxPrice=500"
```

#### Filter by Per Hour Price
```bash
curl "http://localhost:3000/products?minPrice=50&maxPrice=200&pricingType=perHour"
```

#### Filter by Per Day Price
```bash
curl "http://localhost:3000/products?minPrice=500&maxPrice=2000&pricingType=perDay"
```

#### Filter by Daily Price (Resorts)
```bash
curl "http://localhost:3000/products?types=resort&minPrice=200&maxPrice=800&pricingType=daily"
```

#### Filter by Yearly Price (Resorts)
```bash
curl "http://localhost:3000/products?types=resort&minPrice=50000&maxPrice=200000&pricingType=yearly"
```

#### Filter by Capacity
```bash
curl "http://localhost:3000/products?minCapacity=4&maxCapacity=8"
```

### Advanced Filtering

#### Filter by Brand and City
```bash
curl "http://localhost:3000/products?brands=Yamaha,Sea Ray&cities=Dubai,Abu Dhabi"
```

#### Filter Yachts by Type
```bash
curl "http://localhost:3000/products?types=yacht&yachtTypes=motor,sailing"
```

#### Filter Resorts by Type and Rating
```bash
curl "http://localhost:3000/products?types=resort&resortTypes=daily,annual&starRating=4"
```

#### Filter by Daily Resorts (Boolean)
```bash
curl "http://localhost:3000/products?types=resort&isDailyResort=true"
```

#### Filter by Annual Resorts (Boolean)
```bash
curl "http://localhost:3000/products?types=resort&isAnnualResort=true"
```

#### Filter by Event Hosting Resorts
```bash
curl "http://localhost:3000/products?types=resort&canHostEvent=true"
```

#### Filter by Non-Daily Resorts
```bash
curl "http://localhost:3000/products?types=resort&isDailyResort=false"
```

#### Filter by Amenities
```bash
curl "http://localhost:3000/products?types=resort&amenities=WiFi,Parking,Pool"
```

### Search and Tags

#### Search by Text
```bash
curl "http://localhost:3000/products?search=luxury yacht"
```

#### Filter by Tags
```bash
curl "http://localhost:3000/products?tags=luxury,family,romantic"
```

### Complex Combinations

#### Complex Filter Example
```bash
curl "http://localhost:3000/products?types=yacht,jetski&minPrice=200&maxPrice=1000&minCapacity=6&maxCapacity=10&cities=Dubai&brands=Sea Ray&yachtTypes=motor&search=luxury&page=1&limit=10&lang=en"
```

This query will return:
- Yachts and jetskis only
- Price between 200-1000 (default pricing type)
- Capacity between 6-10 people
- Located in Dubai
- Brand: Sea Ray
- Yacht type: motor
- Containing "luxury" in title/description
- First page, 10 results
- English language

#### Complex Filter with Pricing Type
```bash
curl "http://localhost:3000/products?types=yacht,jetski&minPrice=100&maxPrice=500&pricingType=perHour&minCapacity=4&brands=Yamaha&cities=Dubai"
```

This query will return:
- Yachts and jetskis only
- Per hour price between 100-500
- Minimum capacity of 4 people
- Brand: Yamaha
- Located in Dubai

#### Complex Resort Boolean Filter Example
```bash
curl "http://localhost:3000/products?types=resort&isDailyResort=true&isAnnualResort=false&canHostEvent=true&starRating=4&minPrice=200&maxPrice=1000&pricingType=daily"
```

This query will return:
- Resorts only
- Daily resorts (isDailyResort: true)
- Not annual resorts (isAnnualResort: false)
- Can host events (canHostEvent: true)
- 4+ star rating
- Daily price between 200-1000

## Filter Logic

### Product Type Filtering
- **Supported types**: `jetski`, `kayak`, `yacht`, `speedboat`, `resort`
- **Multiple types**: Use comma-separated values
- **Default**: All product types if not specified

### Price Filtering
- **Default behavior**:
  - **Jetski/Kayak/Yacht/Speedboat**: Uses `pricePerHour`
  - **Resort**: Uses `dailyPrice`
- **With `pricingType` parameter**:
  - **`perHour`**: Uses `pricePerHour` for all product types
  - **`perDay`**: Uses `pricePerDay` for non-resort products
  - **`daily`**: Uses `dailyPrice` for resorts
  - **`yearly`**: Uses `yearlyPrice` for resorts
- **Range**: Both `minPrice` and `maxPrice` are optional
- **Logic**: Products within the specified price range for the selected pricing type

### Capacity Filtering
- **Range**: Both `minCapacity` and `maxCapacity` are optional
- **Logic**: Products that can accommodate the specified number of people

### Brand Filtering
- **Applies to**: All product types except resorts
- **Multiple brands**: Use comma-separated values
- **Case-insensitive**: Partial matches supported

### Location Filtering
- **Field**: Uses `cityEn` for filtering
- **Multiple cities**: Use comma-separated values
- **Case-insensitive**: Partial matches supported

### Yacht Type Filtering
- **Applies to**: Yacht products only
- **Supported types**: `motor`, `sailing`, `catamaran`
- **Multiple types**: Use comma-separated values

### Resort Type Filtering
- **Applies to**: Resort products only
- **Supported types**: `daily`, `annual`, `event`
- **Logic**: 
  - `daily` → `isDailyResort: true`
  - `annual` → `isAnnualResort: true`
  - `event` → `canHostEvent: true`

### Resort Boolean Filtering
- **Applies to**: Resort products only
- **`isDailyResort`**: Filter by daily resort availability (true/false)
- **`isAnnualResort`**: Filter by annual resort availability (true/false)
- **`canHostEvent`**: Filter by event hosting capability (true/false)
- **Logic**: Exact boolean match (true/false values)
- **Granular control**: More precise than resortTypes (can filter for specific boolean combinations)

### Star Rating Filtering
- **Applies to**: Resort products only
- **Logic**: Resorts with rating >= specified value
- **Range**: 1-5 stars

### Amenities Filtering
- **Applies to**: Resort products only
- **Field**: Uses `amenitiesEn` array
- **Multiple amenities**: Use comma-separated values
- **Logic**: Resorts that have ALL specified amenities

### Tags Filtering
- **Field**: Uses `tagsEn` array
- **Multiple tags**: Use comma-separated values
- **Logic**: Products that have ANY of the specified tags

### Search Filtering
- **Fields**: Searches in `titleEn`, `titleAr`, `descriptionEn`, `descriptionAr`
- **Logic**: Case-insensitive partial matching
- **Multiple words**: Space-separated (treated as AND logic)

## Performance Considerations

### Database Indexes
The API uses optimized database indexes on:
- `status` (approved products only)
- `type` (product type)
- `pricePerHour`, `pricePerDay`, `dailyPrice`, `yearlyPrice` (price filtering)
- `capacity` (capacity filtering)
- `brand` (brand filtering)
- `cityEn` (location filtering)
- `yachtType` (yacht type filtering)
- `starRating` (resort rating filtering)
- `amenitiesEn` (resort amenities filtering)
- `tagsEn` (tags filtering)

### Query Optimization
- **Lean queries**: Uses `.lean()` for better performance
- **Selective filtering**: Only applies filters that are provided
- **Efficient pagination**: Uses `skip()` and `limit()` for pagination
- **Parallel queries**: Runs queries for different product types in parallel

### Response Optimization
- **Dual language support**: Efficient language transformation
- **Pagination metadata**: Includes total count and page information
- **Filter metadata**: Returns applied filters for frontend state management

## Testing

Use the provided test script:

```bash
# Run comprehensive filter tests
node test/test-product-filters.js
```

The test script includes:
- Basic filter functionality tests
- Complex filter combination tests
- Validation tests for invalid parameters
- Performance tests for large datasets

## Frontend Integration

### React Example
```javascript
const fetchFilteredProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  
  // Add filter parameters
  if (filters.types) params.append('types', filters.types.join(','));
  if (filters.minPrice) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters.minCapacity) params.append('minCapacity', filters.minCapacity);
  if (filters.maxCapacity) params.append('maxCapacity', filters.maxCapacity);
  if (filters.brands) params.append('brands', filters.brands.join(','));
  if (filters.cities) params.append('cities', filters.cities.join(','));
  if (filters.search) params.append('search', filters.search);
  
  // Add pagination
  params.append('page', filters.page || 1);
  params.append('limit', filters.limit || 20);
  
  try {
    const response = await fetch(`/products?${params.toString()}`);
    const data = await response.json();
    
    if (data.success) {
      return {
        products: data.data,
        pagination: data.pagination,
        filters: data.filters
      };
    }
  } catch (error) {
    console.error('Failed to fetch filtered products:', error);
  }
  
  return { products: [], pagination: {}, filters: {} };
};
```

### Vue.js Example
```javascript
async fetchFilteredProducts() {
  try {
    const params = {
      types: this.selectedTypes.join(','),
      minPrice: this.priceRange.min,
      maxPrice: this.priceRange.max,
      minCapacity: this.capacityRange.min,
      maxCapacity: this.capacityRange.max,
      brands: this.selectedBrands.join(','),
      cities: this.selectedCities.join(','),
      search: this.searchTerm,
      page: this.currentPage,
      limit: this.itemsPerPage
    };

    const response = await this.$http.get('/products', { params });
    
    if (response.data.success) {
      this.products = response.data.data;
      this.pagination = response.data.pagination;
      this.appliedFilters = response.data.filters.applied;
    }
  } catch (error) {
    console.error('Failed to fetch filtered products:', error);
  }
}
```

## Error Handling

### Common Error Scenarios
1. **Invalid product type**: Returns empty results for invalid types
2. **Invalid price range**: Handles gracefully (min > max)
3. **Invalid capacity range**: Handles gracefully (min > max)
4. **Invalid star rating**: Handles gracefully (out of 1-5 range)
5. **Empty search term**: Returns all products
6. **Invalid filter combinations**: Returns appropriate results

### Error Response Codes
- **200**: Success with results
- **400**: Bad request (invalid parameters)
- **500**: Internal server error

## Best Practices

### Frontend Implementation
1. **Debounce search**: Implement debouncing for search input
2. **URL state**: Sync filters with URL parameters
3. **Loading states**: Show loading indicators during filter changes
4. **Error handling**: Handle API errors gracefully
5. **Caching**: Cache filter results when appropriate

### Filter Design
1. **Progressive disclosure**: Show most common filters first
2. **Clear filters**: Provide option to clear all filters
3. **Filter counts**: Show number of results for each filter option
4. **Mobile-friendly**: Ensure filters work well on mobile devices
5. **Accessibility**: Make filters accessible to screen readers
