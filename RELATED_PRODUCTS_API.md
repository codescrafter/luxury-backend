# Related Products API

## Overview

The Related Products API provides a "You may like" feature for product detail pages. It finds similar products based on multiple criteria to help users discover relevant items.

## Endpoint

```
GET /products/:type/:productId/related
```

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `type` | string | ✅ | - | Product type: `jetski`, `kayak`, `yacht`, `speedboat`, `resort` |
| `productId` | string | ✅ | - | ID of the current product |
| `limit` | number | ❌ | 10 | Maximum number of related products to return |
| `lang` | string | ❌ | 'en' | Language for response: `en`, `ar` |

## Similarity Criteria

The API finds related products using the following criteria (in order of priority):

### 1. **Strict Matching** (Primary Criteria)
- **Same product type** (jetski, yacht, etc.)
- **Similar price range** (±20% of current product price)
- **Similar capacity** (±2 people difference)
- **Same brand** (if available)
- **Same location** (city/region)

### 2. **Relaxed Matching** (Secondary Criteria)
If not enough products found with strict criteria:
- **Same product type**
- **Broader price range** (±50% of current product price)

### 3. **Fallback** (Tertiary Criteria)
If still not enough products:
- **Same product type** only
- Any approved products of the same type

## Response Format

### Success Response
```json
{
  "success": true,
  "data": [
    {
      "_id": "product_id",
      "titleEn": "Product Title",
      "titleAr": "عنوان المنتج",
      "title": "Product Title", // Based on lang parameter
      "pricePerHour": 100,
      "pricePerDay": 800,
      "dailyPrice": 300, // For resorts
      "capacity": 4,
      "brand": "Yamaha",
      "cityEn": "Dubai",
      "cityAr": "دبي",
      "images": ["image_urls"],
      "videos": ["video_urls"],
      "type": "jetski"
    }
  ]
}
```

### Error Response
```json
{
  "success": false,
  "message": "Failed to get related products",
  "error": "Product not found"
}
```

## Examples

### Get Related Yachts
```bash
curl "http://localhost:3000/products/yacht/507f1f77bcf86cd799439011/related"
```

### Get Related Jetskis with Custom Limit
```bash
curl "http://localhost:3000/products/jetski/507f1f77bcf86cd799439012/related?limit=5"
```

### Get Related Resorts in Arabic
```bash
curl "http://localhost:3000/products/resort/507f1f77bcf86cd799439013/related?lang=ar"
```

## Testing

Use the provided test script:

```bash
# Set environment variables
export PRODUCT_TYPE="yacht"
export PRODUCT_ID="your_yacht_id"

# Run the test
node test/test-related-products.js
```

## Implementation Details

### Algorithm Flow
1. **Fetch current product** details
2. **Build similarity criteria** based on product attributes
3. **Query with strict criteria** first
4. **Relax constraints** if insufficient results
5. **Fallback to basic criteria** if still insufficient
6. **Remove duplicates** and limit results
7. **Transform for dual language** support

### Performance Considerations
- Uses database indexes on `status`, `type`, `pricePerHour`, `pricePerDay`, `capacity`, `brand`, `cityEn`
- Limits results to prevent performance issues
- Uses lean queries for better performance
- Implements progressive fallback to ensure results

### Supported Product Types
- **Jetski**: Uses `pricePerHour`, `pricePerDay`, `capacity`, `brand`
- **Kayak**: Uses `pricePerHour`, `pricePerDay`, `capacity`
- **Yacht**: Uses `pricePerHour`, `pricePerDay`, `capacity`, `brand`, `yachtType`
- **Speedboat**: Uses `pricePerHour`, `pricePerDay`, `capacity`, `brand`
- **Resort**: Uses `dailyPrice`, `capacity`, `starRating`

## Frontend Integration

### React Example
```javascript
const fetchRelatedProducts = async (productType, productId, limit = 10) => {
  try {
    const response = await fetch(
      `/products/${productType}/${productId}/related?limit=${limit}`
    );
    const data = await response.json();
    
    if (data.success) {
      return data.data;
    }
  } catch (error) {
    console.error('Failed to fetch related products:', error);
  }
  return [];
};
```

### Vue.js Example
```javascript
async fetchRelatedProducts() {
  try {
    const response = await this.$http.get(
      `/products/${this.productType}/${this.productId}/related`,
      { params: { limit: 10 } }
    );
    this.relatedProducts = response.data.data;
  } catch (error) {
    console.error('Failed to fetch related products:', error);
  }
}
```
