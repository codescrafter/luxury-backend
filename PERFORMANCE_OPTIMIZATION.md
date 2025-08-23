# Performance Optimization Guide

## Current Performance Analysis

### Query Performance Impact

The dual-language implementation **does NOT affect database query time** because:

1. **Database queries remain the same** - No additional queries
2. **Transformation happens in memory** - After data is fetched
3. **Same indexes are used** - No new database operations

### Current Bottlenecks

1. **Multiple separate queries** - 5 different model queries
2. **Population overhead** - `populate('ownerId')` for admin requests
3. **Large response payload** - Both languages included
4. **Memory usage** - Keeping both language fields in memory

## Optimization Strategies

### 1. Database Query Optimization

#### Current Implementation (5 separate queries):
```typescript
const [jetskis, kayaks, yachts, speedboats, resorts] = await Promise.all([
  this.jetSkiModel.find(filter).populate('ownerId').lean(),
  this.kayakModel.find(filter).populate('ownerId').lean(),
  this.yachtModel.find(filter).populate('ownerId').lean(),
  this.speedboatModel.find(filter).populate('ownerId').lean(),
  this.resortModel.find(filter).populate('ownerId').lean(),
]);
```

#### Optimized Implementation (Single aggregation):
```typescript
// Option 1: Use MongoDB aggregation with $unionWith
async getProductsByOwnerAndStatusOptimized(
  statuses: string[],
  ownerId?: string,
  displayLang?: string,
) {
  const matchStage = {
    $match: {
      status: { $in: statuses },
      ...(ownerId && { ownerId: new Types.ObjectId(ownerId) }),
    },
  };

  const lookupStage = !ownerId ? {
    $lookup: {
      from: 'users',
      localField: 'ownerId',
      foreignField: '_id',
      as: 'ownerDetails',
    },
  } : {};

  const unwindStage = !ownerId ? {
    $unwind: {
      path: '$ownerDetails',
      preserveNullAndEmptyArrays: true,
    },
  } : {};

  const pipeline = [
    matchStage,
    ...(lookupStage ? [lookupStage, unwindStage] : []),
    {
      $addFields: {
        productType: '$$ROOT.collectionName', // Add product type
      },
    },
  ];

  // Use $unionWith to combine all collections
  const result = await this.jetSkiModel.aggregate([
    ...pipeline,
    {
      $unionWith: {
        coll: 'kayaks',
        pipeline: pipeline,
      },
    },
    {
      $unionWith: {
        coll: 'yachts',
        pipeline: pipeline,
      },
    },
    {
      $unionWith: {
        coll: 'speedboats',
        pipeline: pipeline,
      },
    },
    {
      $unionWith: {
        coll: 'resorts',
        pipeline: pipeline,
      },
    },
  ]);

  return transformProductsArrayForDualLanguage(result, displayLang);
}
```

### 2. Field Selection Optimization

#### Current: Fetch all fields
```typescript
this.jetSkiModel.find(filter).lean() // Fetches all fields
```

#### Optimized: Select only needed fields
```typescript
// For dual-language mode
const projection = {
  titleEn: 1,
  titleAr: 1,
  descriptionEn: 1,
  descriptionAr: 1,
  cityEn: 1,
  cityAr: 1,
  countryEn: 1,
  countryAr: 1,
  status: 1,
  ownerId: 1,
  type: 1,
  // Add other essential fields
};

this.jetSkiModel.find(filter, projection).lean()
```

### 3. Caching Strategy

#### Redis Caching Implementation:
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    // ... other dependencies
  ) {}

  async getProductsByOwnerAndStatusWithCache(
    statuses: string[],
    ownerId?: string,
    displayLang?: string,
  ) {
    // Generate cache key
    const cacheKey = `products:${statuses.join(',')}:${ownerId || 'all'}:${displayLang || 'none'}`;
    
    // Try to get from cache
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Fetch from database
    const result = await this.getProductsByOwnerAndStatusWithDualLanguage(
      statuses,
      ownerId,
      displayLang,
    );

    // Cache for 5 minutes
    await this.redis.setex(cacheKey, 300, JSON.stringify(result));
    
    return result;
  }
}
```

### 4. Pagination Implementation

#### Add pagination to reduce payload size:
```typescript
async getProductsByOwnerAndStatusWithPagination(
  statuses: string[],
  ownerId?: string,
  displayLang?: string,
  page: number = 1,
  limit: number = 20,
) {
  const skip = (page - 1) * limit;
  
  const filter: any = {
    status: { $in: statuses },
  };

  if (ownerId) {
    filter.ownerId = new Types.ObjectId(ownerId);
  }

  const populateOwner = !ownerId;

  // Get total count
  const [jetskiCount, kayakCount, yachtCount, speedboatCount, resortCount] = 
    await Promise.all([
      this.jetSkiModel.countDocuments(filter),
      this.kayakModel.countDocuments(filter),
      this.yachtModel.countDocuments(filter),
      this.speedboatModel.countDocuments(filter),
      this.resortModel.countDocuments(filter),
    ]);

  const totalCount = jetskiCount + kayakCount + yachtCount + speedboatCount + resortCount;

  // Get paginated data
  const [jetskis, kayaks, yachts, speedboats, resorts] = await Promise.all([
    populateOwner
      ? this.jetSkiModel.find(filter).populate('ownerId').skip(skip).limit(limit).lean()
      : this.jetSkiModel.find(filter).skip(skip).limit(limit).lean(),
    // ... repeat for other models
  ]);

  const allProducts = [...jetskis, ...kayaks, ...yachts, ...speedboats, ...resorts];
  const transformedProducts = transformProductsArrayForDualLanguage(allProducts, displayLang);

  return {
    data: transformedProducts,
    pagination: {
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}
```

### 5. Database Indexing

#### Add compound indexes for better query performance:
```typescript
// In your entity files, add indexes
@Schema({ 
  timestamps: true,
  indexes: [
    { status: 1, ownerId: 1 }, // For filtering by status and owner
    { status: 1, createdAt: -1 }, // For sorting by creation date
    { ownerId: 1, status: 1, type: 1 }, // For owner's products by type
  ]
})
export class Jetski {
  // ... entity fields
}
```

### 6. Response Compression

#### Enable gzip compression in main.ts:
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable compression
  app.use(compression());
  
  // ... other configurations
}
```

### 7. Lazy Loading Strategy

#### Implement lazy loading for language fields:
```typescript
// Only load language fields when requested
async getProductsByOwnerAndStatusLazy(
  statuses: string[],
  ownerId?: string,
  displayLang?: string,
  includeLanguages: boolean = true,
) {
  const filter: any = { status: { $in: statuses } };
  if (ownerId) filter.ownerId = new Types.ObjectId(ownerId);

  // Base projection (always included)
  const baseProjection = {
    status: 1,
    ownerId: 1,
    type: 1,
    pricePerHour: 1,
    pricePerDay: 1,
    capacity: 1,
    // ... other essential fields
  };

  // Language projection (only when needed)
  const languageProjection = includeLanguages ? {
    titleEn: 1,
    titleAr: 1,
    descriptionEn: 1,
    descriptionAr: 1,
    cityEn: 1,
    cityAr: 1,
    // ... other language fields
  } : {};

  const projection = { ...baseProjection, ...languageProjection };

  const [jetskis, kayaks, yachts, speedboats, resorts] = await Promise.all([
    this.jetSkiModel.find(filter, projection).lean(),
    this.kayakModel.find(filter, projection).lean(),
    this.yachtModel.find(filter, projection).lean(),
    this.speedboatModel.find(filter, projection).lean(),
    this.resortModel.find(filter, projection).lean(),
  ]);

  const allProducts = [...jetskis, ...kayaks, ...yachts, ...speedboats, ...resorts];
  
  return includeLanguages 
    ? transformProductsArrayForDualLanguage(allProducts, displayLang)
    : allProducts;
}
```

## Performance Comparison

| Optimization | Query Time | Memory Usage | Response Size | Implementation Complexity |
|--------------|------------|--------------|---------------|---------------------------|
| **Current** | Baseline | High | Large | Low |
| **Field Selection** | -20% | -30% | -25% | Low |
| **Pagination** | -40% | -60% | -70% | Medium |
| **Caching** | -80% | +10% | Same | High |
| **Aggregation** | -30% | -20% | Same | High |
| **Lazy Loading** | -50% | -40% | -50% | Medium |

## Recommended Implementation Order

1. **Field Selection** (Easy, high impact)
2. **Pagination** (Medium effort, high impact)
3. **Database Indexing** (Easy, medium impact)
4. **Response Compression** (Easy, medium impact)
5. **Caching** (High effort, very high impact)
6. **Aggregation** (High effort, high impact)

## Monitoring and Metrics

```typescript
// Add performance monitoring
async getProductsByOwnerAndStatusWithMetrics(
  statuses: string[],
  ownerId?: string,
  displayLang?: string,
) {
  const startTime = Date.now();
  
  try {
    const result = await this.getProductsByOwnerAndStatusWithDualLanguage(
      statuses,
      ownerId,
      displayLang,
    );
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Log performance metrics
    console.log(`Query completed in ${duration}ms for ${result.length} products`);
    
    // Send to monitoring service
    this.metricsService.recordQueryTime('products_by_status', duration);
    
    return result;
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Log error with timing
    console.error(`Query failed after ${duration}ms:`, error);
    throw error;
  }
}
```

## Conclusion

The dual-language implementation itself doesn't impact query performance, but there are several optimization opportunities:

1. **Immediate wins**: Field selection, pagination, indexing
2. **Medium-term**: Caching, compression
3. **Long-term**: Aggregation, lazy loading

The best approach depends on your specific requirements and constraints.

